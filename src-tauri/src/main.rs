#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/**
 * 关闭窗口
 */
#[tauri::command]
fn close_win(window: tauri::Window) {
    window.close().unwrap();
}

/**
 * 隐藏窗口
 */
#[tauri::command]
fn hide_win(window: tauri::Window) {
    window.hide().unwrap();
}

/**
 * 显示隐藏窗口
 */
#[tauri::command]
fn show_win(window: tauri::Window) {
    window.show().unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, close_win, hide_win, show_win])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
