use std::io;
use std::io::ErrorKind;
use std::path::{Path, PathBuf};
use std::time::UNIX_EPOCH;

use actix_files::NamedFile;
use actix_multipart::Multipart;
use actix_web::http::header;
use actix_web::mime;
use actix_web::{HttpRequest, HttpResponse, Result, error, web};
use futures_util::StreamExt;
use sqlx::{Row, SqlitePool};
use tokio::fs;
use tokio::io::{AsyncReadExt, AsyncSeekExt};
use tokio_util::io::ReaderStream;
use uuid::Uuid;

use crate::config::AppConfig;
use crate::crypto::{decrypt_base64_private, encrypt_base64_public};
use crate::models::*;

#[derive(Clone)]
pub struct AppState {
    pub pool: SqlitePool,
    pub config: AppConfig,
}

const DEFAULT_AVATAR: &str = "https://storage.live.com/users/0xf2a82bac8d704404/myprofile/expressionprofile/profilephoto:UserTileStatic/p?ck=1&ex=720&sid=0CF8A907DF236BE1005BB80EDE136A1C&fofoff=1";

pub async fn hello() -> HttpResponse {
    HttpResponse::Ok().body("Hello World!")
}

pub async fn get_public_key(state: web::Data<AppState>) -> Result<HttpResponse> {
    let content = fs::read_to_string(&state.config.public_key_path)
        .await
        .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Ok()
        .append_header((header::CONTENT_TYPE, "text/plain; charset=utf-8"))
        .body(content))
}

pub async fn register(
    state: web::Data<AppState>,
    body: web::Json<RegisterBody>,
) -> Result<HttpResponse> {
    if body.registered_code.to_uppercase() != "OBJECT" {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "内部注册码错误", 500)));
    }

    let account = decrypt_or_original(&state.config, &body.account);
    let password = decrypt_or_original(&state.config, &body.password);

    let exists = sqlx::query("SELECT id FROM t_user WHERE account = ? LIMIT 1")
        .bind(account.trim())
        .fetch_optional(&state.pool)
        .await
        .map_err(error::ErrorInternalServerError)?;

    if exists.is_some() {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "用户已存在", 500)));
    }

    let encrypted_password = encrypt_base64_public(&state.config.public_key_path, password.trim())
        .map_err(error::ErrorInternalServerError)?;

    sqlx::query(
        "INSERT INTO t_user (user_uuid, nickname, photo, account, password, createtime, del, disable) VALUES (?, ?, ?, ?, ?, ?, 0, 0)",
    )
    .bind(Uuid::new_v4().to_string())
    .bind(body.nick_name.trim())
    .bind(DEFAULT_AVATAR)
    .bind(account.trim())
    .bind(encrypted_password)
    .bind(now_string())
    .execute(&state.pool)
    .await
    .map_err(error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(AjaxResult::<()>::success(None, "注册成功")))
}

pub async fn login(state: web::Data<AppState>, body: web::Json<LoginBody>) -> Result<HttpResponse> {
    if !has_text(&body.account) {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "账号不能为空", 500)));
    }
    if !has_text(&body.password) {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "密码不能为空", 500)));
    }

    let account = decrypt_or_original(&state.config, &body.account);
    let password = decrypt_or_original(&state.config, &body.password);

    let row = sqlx::query(
        "SELECT user_uuid, nickname, photo, password FROM t_user WHERE account = ? AND del = 0 LIMIT 1",
    )
    .bind(account.trim())
    .fetch_optional(&state.pool)
    .await
    .map_err(error::ErrorInternalServerError)?;

    let Some(row) = row else {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "账号不存在", 500)));
    };

    let stored_password: String = row.get("password");
    let decrypted_stored_password = decrypt_or_original(&state.config, &stored_password);

    if decrypted_stored_password.trim() != password.trim() {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "密码错误", 500)));
    }

    let user = UserDefault {
        user_uuid: row.get("user_uuid"),
        nick_name: row.get("nickname"),
        photo: row.get("photo"),
    };

    Ok(HttpResponse::Ok().json(AjaxResult::success(Some(user), "登录成功")))
}

pub async fn update_avatar(
    state: web::Data<AppState>,
    body: web::Json<UpdateAvatarBody>,
) -> Result<HttpResponse> {
    if !has_text(&body.user_uuid) || !has_text(&body.photo) {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "参数错误", 500)));
    }

    if !body.photo.starts_with("data:image/") {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "头像格式错误", 500)));
    }

    if body.photo.len() > 1_500_000 {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "头像过大", 500)));
    }

    let result = sqlx::query("UPDATE t_user SET photo = ? WHERE user_uuid = ? AND del = 0")
        .bind(body.photo.trim())
        .bind(body.user_uuid.trim())
        .execute(&state.pool)
        .await
        .map_err(error::ErrorInternalServerError)?;

    if result.rows_affected() == 0 {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "用户不存在", 500)));
    }

    Ok(HttpResponse::Ok().json(AjaxResult::success(Some(body.photo.clone()), "头像更新成功")))
}

pub async fn add_user_folder(
    state: web::Data<AppState>,
    body: web::Json<AddUserFolderBody>,
) -> Result<HttpResponse> {
    if !has_text(&body.user_uuid) || !has_text(&body.folder_uuid) || !has_text(&body.name) {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "参数错误", 500)));
    }

    let user_uuid = decrypt_or_original(&state.config, &body.user_uuid);
    let existing = sqlx::query(
        "SELECT id, folder_uuid FROM t_folder WHERE user_uuid = ? AND p_uuid = ? AND name = ? AND del = 0 LIMIT 1",
    )
    .bind(&user_uuid)
    .bind(body.folder_uuid.trim())
    .bind(body.name.trim())
    .fetch_optional(&state.pool)
    .await
    .map_err(error::ErrorInternalServerError)?;

    if let Some(row) = existing {
        let folder_id: i64 = row.get("id");
        let encrypted_id = encrypt_base64_public(
            &state.config.public_key_path,
            folder_id.to_string().as_str(),
        )
        .unwrap_or_else(|_| folder_id.to_string());

        return Ok(HttpResponse::Ok().json(AjaxResult::fail(
            Some(encrypted_id),
            "文件夹存在",
            500,
        )));
    }

    let folder_uuid = Uuid::new_v4().to_string();
    let result = sqlx::query(
        "INSERT INTO t_folder (folder_uuid, p_uuid, user_uuid, name, size, create_time, del) VALUES (?, ?, ?, ?, 0, ?, 0)",
    )
    .bind(&folder_uuid)
    .bind(body.folder_uuid.trim())
    .bind(&user_uuid)
    .bind(body.name.trim())
    .bind(now_string())
    .execute(&state.pool)
    .await
    .map_err(error::ErrorInternalServerError)?;

    let inserted_id = result.last_insert_rowid();
    let encrypted_id = encrypt_base64_public(
        &state.config.public_key_path,
        inserted_id.to_string().as_str(),
    )
    .unwrap_or_else(|_| inserted_id.to_string());

    Ok(HttpResponse::Ok().json(AjaxResult::success(Some(encrypted_id), "新建文件夹成功")))
}

pub async fn batch_add_user_folder(
    state: web::Data<AppState>,
    body: web::Json<BatchAddFolderBody>,
) -> Result<HttpResponse> {
    if !has_text(&body.user_uuid) {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "参数错误", 500)));
    }

    for item in &body.data {
        let existing = sqlx::query(
            "SELECT id FROM t_folder WHERE user_uuid = ? AND p_uuid = ? AND name = ? AND del = 0 LIMIT 1",
        )
        .bind(body.user_uuid.trim())
        .bind(item.p_uuid.trim())
        .bind(item.folder_name.trim())
        .fetch_optional(&state.pool)
        .await
        .map_err(error::ErrorInternalServerError)?;

        if existing.is_none() {
            sqlx::query(
                "INSERT INTO t_folder (folder_uuid, p_uuid, user_uuid, name, size, create_time, del) VALUES (?, ?, ?, ?, 0, ?, 0)",
            )
            .bind(item.folder_uuid.trim())
            .bind(item.p_uuid.trim())
            .bind(body.user_uuid.trim())
            .bind(item.folder_name.trim())
            .bind(now_string())
            .execute(&state.pool)
            .await
            .map_err(error::ErrorInternalServerError)?;
        }
    }

    Ok(HttpResponse::Ok().json(AjaxResult::<()>::success(None, "完成")))
}

pub async fn get_user_file_and_folder(
    state: web::Data<AppState>,
    body: web::Json<UserFolderQueryBody>,
) -> Result<HttpResponse> {
    if !has_text(&body.user_uuid) || !has_text(&body.folder_uuid) {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "参数错误", 500)));
    }

    let folders = sqlx::query(
        "SELECT folder_uuid, p_uuid, name, size, create_time FROM t_folder WHERE user_uuid = ? AND p_uuid = ? AND del = 0",
    )
    .bind(body.user_uuid.trim())
    .bind(body.folder_uuid.trim())
    .fetch_all(&state.pool)
    .await
    .map_err(error::ErrorInternalServerError)?;

    let files = sqlx::query(
        "SELECT id, file_sha256, folder_uuid, file_name, suffix, create_time FROM t_user_files WHERE user_uuid = ? AND folder_uuid = ? AND del = 0",
    )
    .bind(body.user_uuid.trim())
    .bind(body.folder_uuid.trim())
    .fetch_all(&state.pool)
    .await
    .map_err(error::ErrorInternalServerError)?;

    let mut result = Vec::with_capacity(folders.len() + files.len());

    for row in folders {
        result.push(UserFileAndFolder {
            id: row.get("folder_uuid"),
            p_uuid: row.get("p_uuid"),
            item_type: "folder".to_string(),
            name: row.get("name"),
            size: row.get::<f64, _>("size"),
            update_time: row.get("create_time"),
            suffix: None,
            file_sha256: None,
            media_type: None,
        });
    }

    for row in files {
        let file_sha256: String = row.get("file_sha256");
        let suffix: String = row.get("suffix");
        let media_type = detect_media_type_cached(
            &state.pool,
            &state.config.upload_dir.join(&file_sha256),
            Some(&suffix),
            "drive",
            &file_sha256,
            None,
        )
        .await?;
        result.push(UserFileAndFolder {
            id: row.get::<i64, _>("id").to_string(),
            p_uuid: row.get("folder_uuid"),
            item_type: "file".to_string(),
            name: row.get("file_name"),
            size: 0.0,
            update_time: row.get("create_time"),
            suffix: Some(suffix),
            file_sha256: Some(file_sha256),
            media_type,
        });
    }

    Ok(HttpResponse::Ok().json(AjaxResult::success(Some(result), "查询成功")))
}

pub async fn get_user_file_for_file_id(
    state: web::Data<AppState>,
    body: web::Json<FileIdBody>,
) -> Result<HttpResponse> {
    if !has_text(&body.id) {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "参数错误", 500)));
    }

    let mut row = None;
    if let Ok(decrypted) = decrypt_base64_private(&state.config.private_key_path, &body.id) {
        if let Ok(parsed_id) = decrypted.parse::<i64>() {
            row = sqlx::query(
                "SELECT file_sha256 FROM t_user_files WHERE id = ? AND del = 0 LIMIT 1",
            )
            .bind(parsed_id)
            .fetch_optional(&state.pool)
            .await
            .map_err(error::ErrorInternalServerError)?;
        }
    }

    if row.is_none() {
        row = sqlx::query(
            "SELECT file_sha256 FROM t_user_files WHERE file_sha256 = ? AND del = 0 LIMIT 1",
        )
        .bind(body.id.trim())
        .fetch_optional(&state.pool)
        .await
        .map_err(error::ErrorInternalServerError)?;
    }

    let Some(row) = row else {
        return Ok(HttpResponse::NotFound().finish());
    };

    let file_sha256: String = row.get("file_sha256");
    stream_file_response(state.config.upload_dir.join(file_sha256), None, None).await
}

pub async fn download_user_folder(
    state: web::Data<AppState>,
    body: web::Json<FolderDownloadBody>,
) -> Result<HttpResponse> {
    if !has_text(&body.user_uuid) || !has_text(&body.id) {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "参数错误", 500)));
    }

    let Some(folder_row) = sqlx::query(
        "SELECT name FROM t_folder WHERE user_uuid = ? AND folder_uuid = ? AND del = 0 LIMIT 1",
    )
    .bind(body.user_uuid.trim())
    .bind(body.id.trim())
    .fetch_optional(&state.pool)
    .await
    .map_err(error::ErrorInternalServerError)?
    else {
        return Ok(HttpResponse::NotFound().finish());
    };

    let folder_name: String = folder_row.get("name");
    let root_name = sanitize_zip_path_part(&folder_name);
    let zip_entries = collect_folder_zip_entries(
        &state.pool,
        &state.config.upload_dir,
        body.user_uuid.trim(),
        body.id.trim(),
        &root_name,
    )
    .await?;
    let zip_bytes = build_store_zip(zip_entries).map_err(error::ErrorInternalServerError)?;
    let filename = format!("{}.zip", root_name);

    Ok(HttpResponse::Ok()
        .append_header((header::CONTENT_TYPE, "application/zip"))
        .append_header((
            header::CONTENT_DISPOSITION,
            format!(
                "attachment; filename=\"{}\"; filename*=UTF-8''{}",
                ascii_filename(&filename),
                percent_encode_filename(&filename)
            ),
        ))
        .body(zip_bytes))
}

pub async fn del_user_file_or_folder(
    state: web::Data<AppState>,
    body: web::Json<DeleteBody>,
) -> Result<HttpResponse> {
    if !has_text(&body.id) || !has_text(&body.item_type) {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "参数错误", 500)));
    }

    let date = now_string();
    let rows_affected = if body.item_type == "file" {
        let file_id = decrypt_or_original(&state.config, &body.id);
        let Ok(parsed_id) = file_id.trim().parse::<i64>() else {
            return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "文件记录不存在", 500)));
        };
        sqlx::query("UPDATE t_user_files SET del = 1, del_time = ? WHERE id = ? AND del = 0")
            .bind(&date)
            .bind(parsed_id)
            .execute(&state.pool)
            .await
            .map_err(error::ErrorInternalServerError)?
            .rows_affected()
    } else {
        sqlx::query("UPDATE t_folder SET del = 1, del_time = ? WHERE folder_uuid = ? AND del = 0")
            .bind(&date)
            .bind(body.id.trim())
            .execute(&state.pool)
            .await
            .map_err(error::ErrorInternalServerError)?
            .rows_affected()
    };

    if rows_affected == 0 {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "删除失败", 500)));
    }

    let message = if body.item_type == "file" {
        "删除文件成功"
    } else {
        "删除文件夹成功"
    };

    Ok(HttpResponse::Ok().json(AjaxResult::<()>::success(None, message)))
}

pub async fn examine_file(
    state: web::Data<AppState>,
    body: web::Json<ExamineFileBody>,
) -> Result<HttpResponse> {
    if !has_text(&body.user_uuid)
        || !has_text(&body.folder_uuid)
        || !has_text(&body.file_sha256)
        || (!has_text(&body.filename) && !has_text(&body.fileext))
    {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "参数错误", 500)));
    }

    let file_exists = sqlx::query("SELECT file_sha256 FROM t_files WHERE file_sha256 = ? LIMIT 1")
        .bind(body.file_sha256.trim())
        .fetch_optional(&state.pool)
        .await
        .map_err(error::ErrorInternalServerError)?
        .is_some();

    let user_file_exists = sqlx::query(
        "SELECT id FROM t_user_files WHERE user_uuid = ? AND folder_uuid = ? AND file_name = ? AND suffix = ? AND del = 0 LIMIT 1",
    )
    .bind(body.user_uuid.trim())
    .bind(body.folder_uuid.trim())
    .bind(body.filename.trim())
    .bind(body.fileext.trim())
    .fetch_optional(&state.pool)
    .await
    .map_err(error::ErrorInternalServerError)?
    .is_some();

    Ok(HttpResponse::Ok().json(AjaxResult::success(
        Some(ExamineFileResult {
            user_file_exist: user_file_exists,
            file_exist: file_exists,
        }),
        "操作成功",
    )))
}

pub async fn upload_stream_file(
    state: web::Data<AppState>,
    query: web::Query<UploadStreamQuery>,
    mut payload: Multipart,
) -> Result<HttpResponse> {
    if !has_text(&query.user_uuid)
        || !has_text(&query.folder_uuid)
        || !has_text(&query.file_path)
        || !has_text(&query.file_sha256)
        || !has_text(&query.current_chunk_max)
        || !has_text(&query.current_chunk_index)
        || (!has_text(&query.file_name) && !has_text(&query.file_ext))
    {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "参数错误", 500)));
    }

    let current_chunk_max = query
        .current_chunk_max
        .trim()
        .parse::<usize>()
        .map_err(error::ErrorBadRequest)?;
    let current_chunk_index = query
        .current_chunk_index
        .trim()
        .parse::<usize>()
        .map_err(error::ErrorBadRequest)?;

    let mut file_bytes = Vec::new();
    while let Some(field) = payload.next().await {
        let mut field = field.map_err(error::ErrorBadRequest)?;
        while let Some(chunk) = field.next().await {
            let chunk = chunk.map_err(error::ErrorBadRequest)?;
            file_bytes.extend_from_slice(&chunk);
        }
    }

    let sha256_dir = state.config.upload_temp_dir.join(query.file_sha256.trim());
    fs::create_dir_all(&state.config.upload_temp_dir)
        .await
        .map_err(error::ErrorInternalServerError)?;
    fs::create_dir_all(&state.config.upload_dir)
        .await
        .map_err(error::ErrorInternalServerError)?;
    fs::create_dir_all(&sha256_dir)
        .await
        .map_err(error::ErrorInternalServerError)?;

    fs::write(sha256_dir.join(current_chunk_index.to_string()), file_bytes)
        .await
        .map_err(error::ErrorInternalServerError)?;

    let mut entries = fs::read_dir(&sha256_dir)
        .await
        .map_err(error::ErrorInternalServerError)?;
    let mut chunk_indexes = Vec::new();
    while let Some(entry) = entries
        .next_entry()
        .await
        .map_err(error::ErrorInternalServerError)?
    {
        if let Some(name) = entry.file_name().to_str() {
            if let Ok(index) = name.parse::<usize>() {
                chunk_indexes.push(index);
            }
        }
    }

    if chunk_indexes.len() != current_chunk_max {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::success(None, "传输进行中")));
    }

    let merge_lock_path = sha256_dir.join(".merge.lock");
    match fs::OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&merge_lock_path)
        .await
    {
        Ok(_) => {}
        Err(err) if err.kind() == ErrorKind::AlreadyExists => {
            return Ok(HttpResponse::Ok().json(AjaxResult::<()>::success(None, "传输完成")));
        }
        Err(err) => return Err(error::ErrorInternalServerError(err)),
    }

    chunk_indexes.sort_unstable();
    let target_path = state.config.upload_dir.join(query.file_sha256.trim());
    let mut target = fs::File::create(&target_path)
        .await
        .map_err(error::ErrorInternalServerError)?;

    for index in chunk_indexes {
        let chunk_path = sha256_dir.join(index.to_string());
        let mut chunk_file = fs::File::open(&chunk_path)
            .await
            .map_err(error::ErrorInternalServerError)?;
        let mut buffer = Vec::new();
        chunk_file
            .read_to_end(&mut buffer)
            .await
            .map_err(error::ErrorInternalServerError)?;
        tokio::io::AsyncWriteExt::write_all(&mut target, &buffer)
            .await
            .map_err(error::ErrorInternalServerError)?;
    }

    sqlx::query("INSERT OR IGNORE INTO t_files (file_sha256, url, disable) VALUES (?, ?, 0)")
        .bind(query.file_sha256.trim())
        .bind(target_path.to_string_lossy().to_string())
        .execute(&state.pool)
        .await
        .map_err(error::ErrorInternalServerError)?;

    let file_name = resolve_available_file_name(
        &state.pool,
        query.user_uuid.trim(),
        query.folder_uuid.trim(),
        query.file_name.trim(),
        query.file_ext.trim(),
    )
    .await
    .map_err(error::ErrorInternalServerError)?;

    sqlx::query(
        "INSERT INTO t_user_files (file_sha256, folder_uuid, user_uuid, file_name, suffix, open, create_time, del)
         SELECT ?, ?, ?, ?, ?, 0, ?, 0
         WHERE NOT EXISTS (
             SELECT 1 FROM t_user_files
             WHERE user_uuid = ? AND folder_uuid = ? AND file_name = ? AND suffix = ? AND del = 0
         )",
    )
    .bind(query.file_sha256.trim())
    .bind(query.folder_uuid.trim())
    .bind(query.user_uuid.trim())
    .bind(&file_name)
    .bind(query.file_ext.trim())
    .bind(now_string())
    .bind(query.user_uuid.trim())
    .bind(query.folder_uuid.trim())
    .bind(&file_name)
    .bind(query.file_ext.trim())
    .execute(&state.pool)
    .await
    .map_err(error::ErrorInternalServerError)?;

    let _ = fs::remove_file(&merge_lock_path).await;
    let _ = fs::remove_dir_all(&sha256_dir).await;

    Ok(HttpResponse::Ok().json(AjaxResult::<()>::success(None, "传输完成")))
}

pub async fn upload_second_pass(
    state: web::Data<AppState>,
    body: web::Json<UploadSecondPassBody>,
) -> Result<HttpResponse> {
    if !has_text(&body.user_uuid)
        || !has_text(&body.folder_uuid)
        || !has_text(&body.file_path)
        || !has_text(&body.file_sha256)
        || (!has_text(&body.file_name) && !has_text(&body.file_ext))
    {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "参数错误", 500)));
    }

    let file_name = resolve_available_file_name(
        &state.pool,
        body.user_uuid.trim(),
        body.folder_uuid.trim(),
        body.file_name.trim(),
        body.file_ext.trim(),
    )
    .await
    .map_err(error::ErrorInternalServerError)?;

    sqlx::query(
        "INSERT INTO t_user_files (file_sha256, folder_uuid, user_uuid, file_name, suffix, open, create_time, del)
         SELECT ?, ?, ?, ?, ?, 0, ?, 0
         WHERE NOT EXISTS (
             SELECT 1 FROM t_user_files
             WHERE user_uuid = ? AND folder_uuid = ? AND file_name = ? AND suffix = ? AND del = 0
         )",
    )
    .bind(body.file_sha256.trim())
    .bind(body.folder_uuid.trim())
    .bind(body.user_uuid.trim())
    .bind(&file_name)
    .bind(body.file_ext.trim())
    .bind(now_string())
    .bind(body.user_uuid.trim())
    .bind(body.folder_uuid.trim())
    .bind(&file_name)
    .bind(body.file_ext.trim())
    .execute(&state.pool)
    .await
    .map_err(error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(AjaxResult::<()>::success(None, "秒传成功")))
}

pub async fn play_video_stream(
    state: web::Data<AppState>,
    body: web::Json<VideoPlayBody>,
) -> Result<HttpResponse> {
    if !has_text(&body.id) {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "参数错误", 500)));
    }

    let row = sqlx::query("SELECT file_sha256 FROM t_user_files WHERE file_sha256 = ? LIMIT 1")
        .bind(body.id.trim())
        .fetch_optional(&state.pool)
        .await
        .map_err(error::ErrorInternalServerError)?;

    let Some(row) = row else {
        return Ok(HttpResponse::NotFound().finish());
    };

    let file_sha256: String = row.get("file_sha256");
    stream_file_response(
        state.config.upload_dir.join(file_sha256),
        body.range.as_deref(),
        None,
    )
    .await
}

pub async fn play_video_stream_by_query(
    state: web::Data<AppState>,
    request: HttpRequest,
    query: web::Query<VideoPlayQuery>,
) -> Result<HttpResponse> {
    if !has_text(&query.id) {
        return Ok(HttpResponse::BadRequest().finish());
    }

    let row = sqlx::query("SELECT file_sha256 FROM t_user_files WHERE file_sha256 = ? LIMIT 1")
        .bind(query.id.trim())
        .fetch_optional(&state.pool)
        .await
        .map_err(error::ErrorInternalServerError)?;

    let Some(row) = row else {
        return Ok(HttpResponse::NotFound().finish());
    };

    let file_sha256: String = row.get("file_sha256");
    let range = request
        .headers()
        .get(header::RANGE)
        .and_then(|value| value.to_str().ok());
    stream_file_response(state.config.upload_dir.join(file_sha256), range, None).await
}

pub async fn play_local_video_stream(
    state: web::Data<AppState>,
    query: web::Query<LocalVideoQuery>,
) -> Result<HttpResponse> {
    stream_file_response(
        state.config.upload_dir.join(query.file_name.trim()),
        None,
        None,
    )
    .await
}

pub async fn get_video_screenshots(
    state: web::Data<AppState>,
    body: web::Json<ScreenshotBody>,
) -> Result<NamedFile> {
    if !has_text(&body.file_sha256) {
        return Err(error::ErrorBadRequest("参数错误"));
    }

    let video_path = state.config.upload_dir.join(body.file_sha256.trim());
    let screenshot_path = PathBuf::from(format!("{}.png", video_path.to_string_lossy()));
    ensure_screenshot(&video_path, &screenshot_path)
        .await
        .map_err(error::ErrorInternalServerError)?;

    NamedFile::open_async(screenshot_path)
        .await
        .map_err(error::ErrorInternalServerError)
}

pub async fn resource_pool_play_video(
    body: web::Json<ResourcePoolPlayBody>,
) -> Result<HttpResponse> {
    if !has_text(&body.path) {
        return Ok(HttpResponse::Ok().json(AjaxResult::<()>::fail(None, "参数错误", 500)));
    }

    stream_file_response(PathBuf::from(body.path.trim()), None, None).await
}

pub async fn resource_pool_play_video_by_query(
    request: HttpRequest,
    query: web::Query<ResourcePoolPlayQuery>,
) -> Result<HttpResponse> {
    if !has_text(&query.path) {
        return Ok(HttpResponse::BadRequest().finish());
    }

    let range = request
        .headers()
        .get(header::RANGE)
        .and_then(|value| value.to_str().ok());
    stream_file_response(PathBuf::from(query.path.trim()), range, None).await
}

pub async fn resource_pool_screenshots(
    state: web::Data<AppState>,
    body: web::Json<ResourcePoolScreenshotBody>,
) -> Result<NamedFile> {
    if !has_text(&body.path) {
        return Err(error::ErrorBadRequest("参数错误"));
    }

    fs::create_dir_all(&state.config.preview_dir)
        .await
        .map_err(error::ErrorInternalServerError)?;

    let screenshot_path =
        state
            .config
            .preview_dir
            .join(format!("{}.{}.png", body.name.trim(), body.ext.trim()));
    ensure_screenshot(Path::new(body.path.trim()), &screenshot_path)
        .await
        .map_err(error::ErrorInternalServerError)?;

    NamedFile::open_async(screenshot_path)
        .await
        .map_err(error::ErrorInternalServerError)
}

pub async fn resource_pool_get_folder_and_file(
    state: web::Data<AppState>,
    body: web::Json<ResourcePoolFolderBody>,
) -> Result<HttpResponse> {
    let target = body
        .path
        .as_deref()
        .filter(|value| has_text(value))
        .map(PathBuf::from)
        .unwrap_or_else(|| state.config.resource_pool_dir.clone());

    let mut entries = fs::read_dir(&target)
        .await
        .map_err(error::ErrorInternalServerError)?;
    let mut result = Vec::new();

    while let Some(entry) = entries
        .next_entry()
        .await
        .map_err(error::ErrorInternalServerError)?
    {
        let entry_path = entry.path();
        let metadata = entry
            .metadata()
            .await
            .map_err(error::ErrorInternalServerError)?;
        let name = entry.file_name().to_string_lossy().to_string();
        if name.starts_with('.') {
            continue;
        }

        if metadata.is_dir() {
            result.push(ResourcePoolItem {
                item_type: "folder".to_string(),
                name,
                ext: None,
                path: entry_path.to_string_lossy().to_string(),
                media_type: None,
            });
        } else {
            let (file_name, file_ext) = split_file_name_and_ext(&name);
            let source_key = entry_path.to_string_lossy().to_string();
            let media_type = detect_media_type_cached(
                &state.pool,
                &entry_path,
                Some(file_ext),
                "resourcepool",
                &source_key,
                Some(&metadata),
            )
            .await?;
            result.push(ResourcePoolItem {
                item_type: "file".to_string(),
                name: file_name.to_string(),
                ext: Some(file_ext.to_string()),
                path: entry_path.to_string_lossy().to_string(),
                media_type,
            });
        }
    }

    Ok(HttpResponse::Ok().json(AjaxResult::success(Some(result), "查询成功")))
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.route("/", web::get().to(hello))
        .service(
            web::scope("/user")
                .route("/getpublickey", web::post().to(get_public_key))
                .route("/registered", web::post().to(register))
                .route("/login", web::post().to(login))
                .route("/updateAvatar", web::post().to(update_avatar)),
        )
        .service(
            web::scope("/drive")
                .route("/addUserFolder", web::post().to(add_user_folder))
                .route("/batchAddUserFolder", web::post().to(batch_add_user_folder))
                .route(
                    "/getUserFileAndFolder",
                    web::post().to(get_user_file_and_folder),
                )
                .route(
                    "/getUserFileForFileId",
                    web::post().to(get_user_file_for_file_id),
                )
                .route(
                    "/downloadUserFolder",
                    web::post().to(download_user_folder),
                )
                .route(
                    "/delUserFileOrFolder",
                    web::post().to(del_user_file_or_folder),
                ),
        )
        .service(
            web::scope("/upload")
                .route("/examineFile", web::post().to(examine_file))
                .route("/uploadStreamFile", web::put().to(upload_stream_file))
                .route("/uploadSecondPass", web::post().to(upload_second_pass)),
        )
        .service(
            web::scope("/video")
                .route("/playVideoSteam", web::post().to(play_video_stream))
                .route("/playVideoSteam", web::get().to(play_video_stream_by_query))
                .route(
                    "/playLocalVideoSteam",
                    web::get().to(play_local_video_stream),
                )
                .route("/getVideoSceenshots", web::post().to(get_video_screenshots)),
        )
        .service(
            web::scope("/resourcepool")
                .route("/playVideoSteam", web::post().to(resource_pool_play_video))
                .route(
                    "/playVideoSteam",
                    web::get().to(resource_pool_play_video_by_query),
                )
                .route(
                    "/getVideoSceenshots",
                    web::post().to(resource_pool_screenshots),
                )
                .route(
                    "/getFolderAndFile",
                    web::post().to(resource_pool_get_folder_and_file),
                ),
        );
}

struct ZipInputEntry {
    name: String,
    data: Vec<u8>,
    is_dir: bool,
}

struct ZipCentralEntry {
    name: String,
    crc32: u32,
    size: u32,
    local_offset: u32,
    is_dir: bool,
}

async fn collect_folder_zip_entries(
    pool: &SqlitePool,
    upload_dir: &Path,
    user_uuid: &str,
    folder_uuid: &str,
    root_name: &str,
) -> Result<Vec<ZipInputEntry>> {
    let mut entries = vec![ZipInputEntry {
        name: format!("{}/", root_name),
        data: Vec::new(),
        is_dir: true,
    }];
    let mut stack = vec![(folder_uuid.to_string(), root_name.to_string())];

    while let Some((current_folder_uuid, current_zip_path)) = stack.pop() {
        let child_folders = sqlx::query(
            "SELECT folder_uuid, name FROM t_folder WHERE user_uuid = ? AND p_uuid = ? AND del = 0 ORDER BY name",
        )
        .bind(user_uuid)
        .bind(&current_folder_uuid)
        .fetch_all(pool)
        .await
        .map_err(error::ErrorInternalServerError)?;

        for row in child_folders {
            let child_uuid: String = row.get("folder_uuid");
            let child_name: String = row.get("name");
            let child_zip_path = format!("{}/{}", current_zip_path, sanitize_zip_path_part(&child_name));
            entries.push(ZipInputEntry {
                name: format!("{}/", child_zip_path),
                data: Vec::new(),
                is_dir: true,
            });
            stack.push((child_uuid, child_zip_path));
        }

        let files = sqlx::query(
            "SELECT file_name, suffix, file_sha256 FROM t_user_files WHERE user_uuid = ? AND folder_uuid = ? AND del = 0 ORDER BY file_name",
        )
        .bind(user_uuid)
        .bind(&current_folder_uuid)
        .fetch_all(pool)
        .await
        .map_err(error::ErrorInternalServerError)?;

        for row in files {
            let file_name: String = row.get("file_name");
            let suffix: String = row.get("suffix");
            let file_sha256: String = row.get("file_sha256");
            let display_name = if suffix.trim().is_empty() {
                file_name
            } else {
                format!("{}.{}", file_name, suffix)
            };
            let data = fs::read(upload_dir.join(file_sha256))
                .await
                .map_err(error::ErrorInternalServerError)?;
            entries.push(ZipInputEntry {
                name: format!("{}/{}", current_zip_path, sanitize_zip_path_part(&display_name)),
                data,
                is_dir: false,
            });
        }
    }

    Ok(entries)
}

fn sanitize_zip_path_part(value: &str) -> String {
    let sanitized = value
        .trim()
        .replace('\\', "_")
        .replace('/', "_")
        .replace('\0', "");

    if sanitized.is_empty() {
        "未命名".to_string()
    } else {
        sanitized
    }
}

fn ascii_filename(value: &str) -> String {
    value
        .chars()
        .map(|ch| {
            if ch.is_ascii_alphanumeric() || matches!(ch, '.' | '-' | '_' | ' ') {
                ch
            } else {
                '_'
            }
        })
        .collect()
}

fn percent_encode_filename(value: &str) -> String {
    let mut encoded = String::new();
    for byte in value.as_bytes() {
        if byte.is_ascii_alphanumeric() || matches!(byte, b'.' | b'-' | b'_') {
            encoded.push(*byte as char);
        } else {
            encoded.push_str(&format!("%{:02X}", byte));
        }
    }
    encoded
}

fn push_u16(buffer: &mut Vec<u8>, value: u16) {
    buffer.extend_from_slice(&value.to_le_bytes());
}

fn push_u32(buffer: &mut Vec<u8>, value: u32) {
    buffer.extend_from_slice(&value.to_le_bytes());
}

fn crc32(bytes: &[u8]) -> u32 {
    let mut crc = 0xffff_ffffu32;
    for byte in bytes {
        crc ^= *byte as u32;
        for _ in 0..8 {
            let mask = (crc & 1).wrapping_neg();
            crc = (crc >> 1) ^ (0xedb8_8320 & mask);
        }
    }
    !crc
}

fn to_zip_u32(value: usize) -> io::Result<u32> {
    u32::try_from(value).map_err(|_| io::Error::new(ErrorKind::InvalidData, "ZIP 文件过大"))
}

fn build_store_zip(entries: Vec<ZipInputEntry>) -> io::Result<Vec<u8>> {
    let mut output = Vec::new();
    let mut central_entries = Vec::new();

    for entry in entries {
        let name_bytes = entry.name.as_bytes();
        let crc = if entry.is_dir { 0 } else { crc32(&entry.data) };
        let size = to_zip_u32(entry.data.len())?;
        let local_offset = to_zip_u32(output.len())?;

        push_u32(&mut output, 0x0403_4b50);
        push_u16(&mut output, 20);
        push_u16(&mut output, 0x0800);
        push_u16(&mut output, 0);
        push_u16(&mut output, 0);
        push_u16(&mut output, 0);
        push_u32(&mut output, crc);
        push_u32(&mut output, size);
        push_u32(&mut output, size);
        push_u16(&mut output, u16::try_from(name_bytes.len()).map_err(|_| io::Error::new(ErrorKind::InvalidData, "文件名过长"))?);
        push_u16(&mut output, 0);
        output.extend_from_slice(name_bytes);
        output.extend_from_slice(&entry.data);

        central_entries.push(ZipCentralEntry {
            name: entry.name,
            crc32: crc,
            size,
            local_offset,
            is_dir: entry.is_dir,
        });
    }

    let central_offset = to_zip_u32(output.len())?;
    for entry in &central_entries {
        let name_bytes = entry.name.as_bytes();
        push_u32(&mut output, 0x0201_4b50);
        push_u16(&mut output, 20);
        push_u16(&mut output, 20);
        push_u16(&mut output, 0x0800);
        push_u16(&mut output, 0);
        push_u16(&mut output, 0);
        push_u16(&mut output, 0);
        push_u32(&mut output, entry.crc32);
        push_u32(&mut output, entry.size);
        push_u32(&mut output, entry.size);
        push_u16(&mut output, u16::try_from(name_bytes.len()).map_err(|_| io::Error::new(ErrorKind::InvalidData, "文件名过长"))?);
        push_u16(&mut output, 0);
        push_u16(&mut output, 0);
        push_u16(&mut output, 0);
        push_u16(&mut output, 0);
        push_u32(&mut output, if entry.is_dir { 0x10 << 16 } else { 0 });
        push_u32(&mut output, entry.local_offset);
        output.extend_from_slice(name_bytes);
    }

    let central_size = to_zip_u32(output.len())? - central_offset;
    let entry_count = u16::try_from(central_entries.len())
        .map_err(|_| io::Error::new(ErrorKind::InvalidData, "ZIP 条目过多"))?;

    push_u32(&mut output, 0x0605_4b50);
    push_u16(&mut output, 0);
    push_u16(&mut output, 0);
    push_u16(&mut output, entry_count);
    push_u16(&mut output, entry_count);
    push_u32(&mut output, central_size);
    push_u32(&mut output, central_offset);
    push_u16(&mut output, 0);

    Ok(output)
}

async fn stream_file_response(
    path: PathBuf,
    range: Option<&str>,
    content_type: Option<mime::Mime>,
) -> Result<HttpResponse> {
    let metadata = fs::metadata(&path).await.map_err(error::ErrorNotFound)?;
    let file_size = metadata.len();
    let mime = content_type.unwrap_or_else(|| mime_guess::from_path(&path).first_or_octet_stream());

    if let Some(range) = range.filter(|value| has_text(value)) {
        let (start, end) =
            parse_range(range, file_size).ok_or_else(|| error::ErrorBadRequest("无效 range"))?;
        let chunk_size = end - start + 1;
        let mut file = fs::File::open(&path)
            .await
            .map_err(error::ErrorInternalServerError)?;
        file.seek(std::io::SeekFrom::Start(start))
            .await
            .map_err(error::ErrorInternalServerError)?;
        let stream = ReaderStream::new(file.take(chunk_size));

        Ok(HttpResponse::PartialContent()
            .append_header((header::CONTENT_TYPE, mime.to_string()))
            .append_header((
                header::CONTENT_RANGE,
                format!("bytes {}-{}/{}", start, end, file_size),
            ))
            .append_header((header::ACCEPT_RANGES, "bytes"))
            .append_header((header::CONTENT_LENGTH, chunk_size.to_string()))
            .streaming(stream))
    } else {
        let file = fs::File::open(&path)
            .await
            .map_err(error::ErrorInternalServerError)?;
        let stream = ReaderStream::new(file);

        Ok(HttpResponse::Ok()
            .append_header((header::CONTENT_TYPE, mime.to_string()))
            .append_header((header::ACCEPT_RANGES, "bytes"))
            .append_header((header::CONTENT_LENGTH, file_size.to_string()))
            .streaming(stream))
    }
}

fn parse_range(range: &str, file_size: u64) -> Option<(u64, u64)> {
    let cleaned = range.trim().strip_prefix("bytes=")?;
    let mut parts = cleaned.splitn(2, '-');
    let start = parts.next()?.parse::<u64>().ok()?;
    let requested_end = parts.next().and_then(|value| {
        if value.is_empty() {
            None
        } else {
            value.parse::<u64>().ok()
        }
    });
    let mut end = requested_end.unwrap_or(start.saturating_add(999_999));
    end = end.min(file_size.saturating_sub(1));
    if start > end {
        return None;
    }
    Some((start, end))
}

async fn ensure_screenshot(video_path: &Path, screenshot_path: &Path) -> io::Result<()> {
    if screenshot_path.exists() {
        return Ok(());
    }

    if let Some(parent) = screenshot_path.parent() {
        fs::create_dir_all(parent).await?;
    }

    tokio::process::Command::new("ffmpeg")
        .arg("-i")
        .arg(video_path)
        .arg("-y")
        .arg("-f")
        .arg("image2")
        .arg("-frames")
        .arg("1")
        .arg(screenshot_path)
        .output()
        .await
        .map(|_| ())
}

fn infer_media_type_by_extension(ext: Option<&str>) -> Option<String> {
    match ext?
        .trim()
        .trim_start_matches('.')
        .to_ascii_lowercase()
        .as_str()
    {
        "mp4" | "avi" | "wmv" | "m4v" | "mov" | "asf" | "flv" | "f4v" | "rmvb" | "rm" | "3gp"
        | "vob" | "mkv" | "webm" | "mpeg" | "mpg" | "ts" | "mts" | "m2ts" => {
            Some("video".to_string())
        }
        "mp3" | "aac" | "m4a" | "wav" | "ogg" | "oga" | "alac" | "flac" | "ape" | "wma"
        | "opus" => Some("audio".to_string()),
        _ => None,
    }
}

fn media_cache_value(media_type: Option<&str>) -> &str {
    media_type.unwrap_or("unknown")
}

fn media_type_from_cache(value: String) -> Option<String> {
    if value == "unknown" || value.trim().is_empty() {
        None
    } else {
        Some(value)
    }
}

fn metadata_cache_key(metadata: &std::fs::Metadata) -> (i64, i64) {
    let file_size = i64::try_from(metadata.len()).unwrap_or(i64::MAX);
    let modified_time = metadata
        .modified()
        .ok()
        .and_then(|value| value.duration_since(UNIX_EPOCH).ok())
        .map(|value| i64::try_from(value.as_secs()).unwrap_or(i64::MAX))
        .unwrap_or(0);
    (file_size, modified_time)
}

async fn detect_media_type_cached(
    pool: &SqlitePool,
    path: &Path,
    ext: Option<&str>,
    source_type: &str,
    source_key: &str,
    metadata: Option<&std::fs::Metadata>,
) -> Result<Option<String>> {
    let (file_size, modified_time) = match metadata {
        Some(value) => metadata_cache_key(value),
        None => match fs::metadata(path).await {
            Ok(value) => metadata_cache_key(&value),
            Err(_) => (0, 0),
        },
    };

    if let Some(row) = sqlx::query(
        "SELECT media_type FROM t_media_type_cache
         WHERE source_type = ? AND source_key = ? AND file_size = ? AND modified_time = ?
         LIMIT 1",
    )
    .bind(source_type)
    .bind(source_key)
    .bind(file_size)
    .bind(modified_time)
    .fetch_optional(pool)
    .await
    .map_err(error::ErrorInternalServerError)?
    {
        return Ok(media_type_from_cache(row.get("media_type")));
    }

    let detected = detect_media_type(path, ext).await;
    sqlx::query(
        "INSERT INTO t_media_type_cache (source_type, source_key, file_size, modified_time, media_type, update_time)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(source_type, source_key) DO UPDATE SET
             file_size = excluded.file_size,
             modified_time = excluded.modified_time,
             media_type = excluded.media_type,
             update_time = excluded.update_time",
    )
    .bind(source_type)
    .bind(source_key)
    .bind(file_size)
    .bind(modified_time)
    .bind(media_cache_value(detected.as_deref()))
    .bind(now_string())
    .execute(pool)
    .await
    .map_err(error::ErrorInternalServerError)?;

    Ok(detected)
}

async fn detect_media_type(path: &Path, ext: Option<&str>) -> Option<String> {
    if let Some(media_type) = infer_media_type_by_extension(
        ext.or_else(|| path.extension().and_then(|value| value.to_str())),
    ) {
        return Some(media_type);
    }

    let video_output = tokio::process::Command::new("ffprobe")
        .arg("-v")
        .arg("error")
        .arg("-select_streams")
        .arg("v:0")
        .arg("-show_entries")
        .arg("stream=codec_type")
        .arg("-of")
        .arg("csv=p=0")
        .arg(path)
        .output()
        .await
        .ok()?;

    if video_output.status.success()
        && String::from_utf8_lossy(&video_output.stdout)
            .lines()
            .any(|line| line.trim() == "video")
    {
        return Some("video".to_string());
    }

    let audio_output = tokio::process::Command::new("ffprobe")
        .arg("-v")
        .arg("error")
        .arg("-select_streams")
        .arg("a:0")
        .arg("-show_entries")
        .arg("stream=codec_type")
        .arg("-of")
        .arg("csv=p=0")
        .arg(path)
        .output()
        .await
        .ok()?;

    if audio_output.status.success()
        && String::from_utf8_lossy(&audio_output.stdout)
            .lines()
            .any(|line| line.trim() == "audio")
    {
        return Some("audio".to_string());
    }

    None
}

fn now_string() -> String {
    chrono::Local::now().format("%Y-%m-%d %H:%M %S").to_string()
}

async fn resolve_available_file_name(
    pool: &SqlitePool,
    user_uuid: &str,
    folder_uuid: &str,
    file_name: &str,
    suffix: &str,
) -> Result<String, sqlx::Error> {
    let mut index = 0;

    loop {
        let candidate = if index == 0 {
            file_name.to_string()
        } else {
            format!("{file_name} ({index})")
        };

        let exists = sqlx::query(
            "SELECT id FROM t_user_files WHERE user_uuid = ? AND folder_uuid = ? AND file_name = ? AND suffix = ? AND del = 0 LIMIT 1",
        )
        .bind(user_uuid)
        .bind(folder_uuid)
        .bind(&candidate)
        .bind(suffix)
        .fetch_optional(pool)
        .await?
        .is_some();

        if !exists {
            return Ok(candidate);
        }

        index += 1;
    }
}

fn has_text(value: &str) -> bool {
    !value.trim().is_empty()
}

fn decrypt_or_original(config: &AppConfig, value: &str) -> String {
    decrypt_base64_private(&config.private_key_path, value).unwrap_or_else(|_| value.to_string())
}

fn split_file_name_and_ext(value: &str) -> (&str, &str) {
    if let Some((name, ext)) = value.rsplit_once('.') {
        (name, ext)
    } else {
        (value, "")
    }
}
