use std::fs;

use actix_cors::Cors;
use actix_files::Files;
use actix_web::middleware::Logger;
use actix_web::{App, HttpServer, web};

mod config;
mod crypto;
mod handlers;
mod models;
mod sqltool;

use config::AppConfig;
use crypto::ensure_keypair;
use handlers::AppState;
use sqltool::open_sql;

fn show_banner() {
    if let Ok(file) = fs::read_to_string("../serve/resources/banner.txt") {
        println!("{file}");
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();

    let config = AppConfig::load();
    fs::create_dir_all(&config.key_dir)?;
    fs::create_dir_all(&config.upload_temp_dir)?;
    fs::create_dir_all(&config.upload_dir)?;
    fs::create_dir_all(&config.preview_dir)?;
    ensure_keypair(&config.public_key_path, &config.private_key_path)?;

    let pool = open_sql(&config).await.map_err(std::io::Error::other)?;
    let state = web::Data::new(AppState {
        pool,
        config: config.clone(),
    });
    let static_dir = config.static_dir.clone();

    show_banner();
    println!("the application start on the 3000 port...");

    HttpServer::new(move || {
        let cors = Cors::permissive();
        let app = App::new()
            .app_data(state.clone())
            .wrap(Logger::default())
            .wrap(cors)
            .configure(handlers::config);

        if static_dir.exists() {
            app.service(Files::new("/static", static_dir.clone()))
        } else {
            app
        }
    })
    .bind(("0.0.0.0", 3000))?
    .run()
    .await
}
