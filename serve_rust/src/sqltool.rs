use std::str::FromStr;

use sqlx::SqlitePool;
use sqlx::sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePoolOptions};

use crate::config::AppConfig;

pub async fn open_sql(config: &AppConfig) -> Result<SqlitePool, sqlx::Error> {
    let db_url = format!("sqlite://{}", config.db_path.display());
    let connection_options = SqliteConnectOptions::from_str(&db_url)?
        .journal_mode(SqliteJournalMode::Wal)
        .create_if_missing(true);

    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect_with(connection_options)
        .await?;

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS t_files (
            file_hash TEXT PRIMARY KEY,
            hash_algorithm TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            storage_path TEXT NOT NULL,
            create_time TEXT NOT NULL,
            disable INTEGER NOT NULL DEFAULT 0,
            disable_time TEXT
        );

        CREATE TABLE IF NOT EXISTS t_folder (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            folder_uuid TEXT NOT NULL,
            p_uuid TEXT NOT NULL,
            user_uuid TEXT NOT NULL,
            name TEXT NOT NULL,
            size REAL NOT NULL DEFAULT 0,
            create_time TEXT NOT NULL,
            del INTEGER NOT NULL DEFAULT 0,
            del_time TEXT
        );

        CREATE TABLE IF NOT EXISTS t_user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_uuid TEXT NOT NULL,
            nickname TEXT NOT NULL,
            photo TEXT NOT NULL,
            account TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            disable INTEGER NOT NULL DEFAULT 0,
            disable_time TEXT,
            createtime TEXT NOT NULL,
            del INTEGER NOT NULL DEFAULT 0,
            del_time TEXT
        );

        CREATE TABLE IF NOT EXISTS t_user_files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_hash TEXT NOT NULL,
            folder_uuid TEXT NOT NULL,
            user_uuid TEXT NOT NULL,
            file_name TEXT NOT NULL,
            suffix TEXT NOT NULL,
            file_size INTEGER NOT NULL DEFAULT 0,
            open INTEGER NOT NULL DEFAULT 0,
            create_time TEXT NOT NULL,
            del INTEGER NOT NULL DEFAULT 0,
            del_time TEXT,
            FOREIGN KEY(file_hash) REFERENCES t_files(file_hash)
        );

        CREATE TABLE IF NOT EXISTS t_media_type_cache (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_type TEXT NOT NULL,
            source_key TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            modified_time INTEGER NOT NULL,
            media_type TEXT NOT NULL,
            update_time TEXT NOT NULL,
            UNIQUE(source_type, source_key)
        );

        CREATE TABLE IF NOT EXISTS t_media_duration_cache (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_type TEXT NOT NULL,
            source_key TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            modified_time INTEGER NOT NULL,
            duration REAL NOT NULL,
            update_time TEXT NOT NULL,
            UNIQUE(source_type, source_key)
        );

        CREATE INDEX IF NOT EXISTS idx_user_account ON t_user(account);
        CREATE INDEX IF NOT EXISTS idx_folder_user_parent ON t_folder(user_uuid, p_uuid, del);
        CREATE INDEX IF NOT EXISTS idx_user_files_folder ON t_user_files(user_uuid, folder_uuid, del);
        CREATE INDEX IF NOT EXISTS idx_files_algorithm ON t_files(hash_algorithm);
        CREATE INDEX IF NOT EXISTS idx_user_files_hash ON t_user_files(file_hash, del);
        CREATE UNIQUE INDEX IF NOT EXISTS uk_user_file_name_active ON t_user_files(user_uuid, folder_uuid, file_name, suffix) WHERE del = 0;
        CREATE INDEX IF NOT EXISTS idx_media_type_cache_source ON t_media_type_cache(source_type, source_key);
        CREATE INDEX IF NOT EXISTS idx_media_duration_cache_source ON t_media_duration_cache(source_type, source_key);
        "#,
    )
    .execute(&pool)
    .await?;

    Ok(pool)
}
