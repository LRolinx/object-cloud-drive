use std::env;
use std::path::PathBuf;

#[derive(Clone, Debug)]
pub struct AppConfig {
    pub db_path: PathBuf,
    pub key_dir: PathBuf,
    pub public_key_path: PathBuf,
    pub private_key_path: PathBuf,
    pub upload_temp_dir: PathBuf,
    pub upload_dir: PathBuf,
    pub preview_dir: PathBuf,
    pub resource_pool_dir: PathBuf,
    pub static_dir: PathBuf,
}

impl AppConfig {
    pub fn load() -> Self {
        let user_home = env::var("HOME")
            .or_else(|_| env::var("USERPROFILE"))
            .unwrap_or_else(|_| ".".to_string());
        let objectcloud_root = PathBuf::from(user_home).join(".objectcloud");
        let key_dir = objectcloud_root.join("key");

        Self {
            db_path: PathBuf::from("objcloud.db3"),
            public_key_path: key_dir.join("public.key"),
            private_key_path: key_dir.join("private.key"),
            key_dir,
            upload_temp_dir: objectcloud_root.join("temp"),
            upload_dir: objectcloud_root.join("upload"),
            preview_dir: objectcloud_root.join("preview"),
            resource_pool_dir: PathBuf::from("/Volumes/Data/Movies"),
            static_dir: PathBuf::from("src/"),
        }
    }
}
