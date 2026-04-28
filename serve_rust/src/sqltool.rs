use std::str::FromStr;

use sqlx::{SqlitePool, sqlite::SqliteConnectOptions};

pub async fn openSql() -> Result<(), sqlx::Error> {
    let db_url = "objcloud.db3";

    let connection_options =
        SqliteConnectOptions::from_str(format!("sqlite://{}", db_url).as_str())?
            .journal_mode(sqlx::sqlite::SqliteJournalMode::Wal)
            .read_only(true)
            .create_if_missing(true);

    let conn = SqlitePool::connect_with(connection_options)
        .await?;

    sqlx::query(
        "

		CREATE TABLE if not exists t_files (
            file_sha256 TEXT PRIMARY KEY,
            url TEXT NOT NULL,
            disable TEXT NOT NULL,
            disable_time TEXT NOT NULL,
         )
		 
		 CREATE TABLE if not exists t_folder (
            id TEXT PRIMARY KEY,
            folder_uuid TEXT NOT NULL,
            p_uuid TEXT NOT NULL,
            user_uuid TEXT NOT NULL,
            name TEXT NOT NULL,
            size TEXT NOT NULL,
            create_time TEXT NOT NULL,
            del TEXT NOT NULL,
            del_time TEXT NOT NULL,
         )

		 CREATE TABLE if not exists t_user (
            id TEXT PRIMARY KEY,
            user_uuid TEXT NOT NULL,
            nickname TEXT NOT NULL,
            photo TEXT NOT NULL,
            account TEXT NOT NULL,
            password TEXT NOT NULL,
            disable TEXT NOT NULL,
            disable_time TEXT NOT NULL,
            create_time TEXT NOT NULL,
            del TEXT NOT NULL,
            del_time TEXT NOT NULL,
         )

		 CREATE TABLE if not exists t_user_files (
            id TEXT PRIMARY KEY,
            file_sha256 TEXT NOT NULL,
            folder_uuid TEXT NOT NULL,
            user_uuid TEXT NOT NULL,
            file_name TEXT NOT NULL,
            suffix TEXT NOT NULL,
            open TEXT NOT NULL,
            create_time TEXT NOT NULL,
            del TEXT NOT NULL,
            del_time TEXT NOT NULL,
         )
		 
		 ",
    )
    .execute(&conn)
    .await?;

    Ok(())
}
