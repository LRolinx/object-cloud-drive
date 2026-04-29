use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct AjaxResult<T>
where
    T: Serialize,
{
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<T>,
    pub code: i32,
    pub state: bool,
    pub message: String,
}

impl<T> AjaxResult<T>
where
    T: Serialize,
{
    pub fn success(data: Option<T>, message: impl Into<String>) -> Self {
        Self {
            data,
            code: 200,
            state: true,
            message: message.into(),
        }
    }

    pub fn fail(data: Option<T>, message: impl Into<String>, code: i32) -> Self {
        Self {
            data,
            code,
            state: false,
            message: message.into(),
        }
    }
}

#[derive(Serialize)]
pub struct UserDefault {
    #[serde(rename = "userUuid")]
    pub user_uuid: String,
    #[serde(rename = "nickName")]
    pub nick_name: String,
    pub photo: String,
}

#[derive(Serialize)]
pub struct UserFileAndFolder {
    pub id: String,
    #[serde(rename = "pUUid")]
    pub p_uuid: String,
    #[serde(rename = "type")]
    pub item_type: String,
    pub name: String,
    pub size: f64,
    #[serde(rename = "updateTime")]
    pub update_time: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub suffix: Option<String>,
    #[serde(rename = "fileSha256", skip_serializing_if = "Option::is_none")]
    pub file_sha256: Option<String>,
    #[serde(rename = "mediaType", skip_serializing_if = "Option::is_none")]
    pub media_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub duration: Option<f64>,
}

#[derive(Serialize)]
pub struct ExamineFileResult {
    #[serde(rename = "userFileExist")]
    pub user_file_exist: bool,
    #[serde(rename = "fileExist")]
    pub file_exist: bool,
}

#[derive(Serialize)]
pub struct ResourcePoolItem {
    #[serde(rename = "type")]
    pub item_type: String,
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ext: Option<String>,
    pub path: String,
    #[serde(rename = "mediaType", skip_serializing_if = "Option::is_none")]
    pub media_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub duration: Option<f64>,
}

#[derive(Deserialize)]
pub struct RegisterBody {
    #[serde(rename = "nickName")]
    pub nick_name: String,
    pub account: String,
    pub password: String,
    #[serde(rename = "registeredCode")]
    pub registered_code: String,
}

#[derive(Deserialize)]
pub struct LoginBody {
    pub account: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct UpdateAvatarBody {
    #[serde(rename = "userUuid")]
    pub user_uuid: String,
    pub photo: String,
}

#[derive(Deserialize)]
pub struct AddUserFolderBody {
    #[serde(rename = "userUuid")]
    pub user_uuid: String,
    #[serde(rename = "folderUuid")]
    pub folder_uuid: String,
    pub name: String,
}

#[derive(Deserialize)]
pub struct BatchAddFolderBody {
    #[serde(rename = "userUuid")]
    pub user_uuid: String,
    pub data: Vec<BatchFolderItem>,
}

#[derive(Deserialize)]
pub struct BatchFolderItem {
    #[serde(rename = "folderName")]
    pub folder_name: String,
    #[serde(rename = "pUuid")]
    pub p_uuid: String,
    #[serde(rename = "folderUuid")]
    pub folder_uuid: String,
}

#[derive(Deserialize)]
pub struct UserFolderQueryBody {
    #[serde(rename = "userUuid")]
    pub user_uuid: String,
    #[serde(rename = "folderUuid")]
    pub folder_uuid: String,
}

#[derive(Deserialize)]
pub struct FileIdBody {
    pub id: String,
}

#[derive(Deserialize)]
pub struct FolderDownloadBody {
    #[serde(rename = "userUuid")]
    pub user_uuid: String,
    pub id: String,
}

#[derive(Deserialize)]
pub struct DeleteBody {
    pub id: String,
    #[serde(rename = "type")]
    pub item_type: String,
}

#[derive(Deserialize)]
pub struct ExamineFileBody {
    #[serde(rename = "userUuid")]
    pub user_uuid: String,
    #[serde(rename = "folderUuid")]
    pub folder_uuid: String,
    #[serde(rename = "fileSha256")]
    pub file_sha256: String,
    pub filename: String,
    pub fileext: String,
}

#[derive(Deserialize)]
pub struct UploadSecondPassBody {
    #[serde(rename = "userUuid")]
    pub user_uuid: String,
    #[serde(rename = "folderUuid")]
    pub folder_uuid: String,
    #[serde(rename = "fileName")]
    pub file_name: String,
    #[serde(rename = "filePath")]
    pub file_path: String,
    #[serde(rename = "fileExt")]
    pub file_ext: String,
    #[serde(rename = "fileSha256")]
    pub file_sha256: String,
}

#[derive(Deserialize)]
pub struct UploadStreamQuery {
    #[serde(rename = "userUuid")]
    pub user_uuid: String,
    #[serde(rename = "folderUuid")]
    pub folder_uuid: String,
    #[serde(rename = "fileName")]
    pub file_name: String,
    #[serde(rename = "filePath")]
    pub file_path: String,
    #[serde(rename = "fileExt")]
    pub file_ext: String,
    #[serde(rename = "fileSha256")]
    pub file_sha256: String,
    #[serde(rename = "currentChunkMax")]
    pub current_chunk_max: String,
    #[serde(rename = "currentChunkIndex")]
    pub current_chunk_index: String,
}

#[derive(Deserialize)]
pub struct VideoPlayBody {
    pub id: String,
    pub range: Option<String>,
}

#[derive(Deserialize)]
pub struct LocalVideoQuery {
    #[serde(rename = "fileName")]
    pub file_name: String,
}

#[derive(Deserialize)]
pub struct VideoPlayQuery {
    pub id: String,
    #[serde(rename = "audioStart")]
    pub audio_start: Option<f64>,
}

#[derive(Deserialize)]
pub struct ScreenshotBody {
    #[serde(rename = "fileSha256")]
    pub file_sha256: String,
}

#[derive(Deserialize)]
pub struct ResourcePoolPlayBody {
    pub path: String,
}

#[derive(Deserialize)]
pub struct ResourcePoolPlayQuery {
    pub path: String,
    #[serde(rename = "audioStart")]
    pub audio_start: Option<f64>,
}

#[derive(Deserialize)]
pub struct ResourcePoolScreenshotBody {
    pub name: String,
    pub ext: String,
    pub path: String,
}

#[derive(Deserialize)]
pub struct ResourcePoolFolderBody {
    pub path: Option<String>,
    pub page: Option<usize>,
    #[serde(rename = "pageSize")]
    pub page_size: Option<usize>,
}

#[derive(Serialize)]
pub struct ResourcePoolFolderPage {
    pub items: Vec<ResourcePoolItem>,
    pub page: usize,
    #[serde(rename = "pageSize")]
    pub page_size: usize,
    #[serde(rename = "hasMore")]
    pub has_more: bool,
}
