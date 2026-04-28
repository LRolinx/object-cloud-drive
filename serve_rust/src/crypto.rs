use std::fs;
use std::io;
use std::path::Path;

use base64::Engine;
use base64::engine::general_purpose::STANDARD;
use rand::rngs::OsRng;
use rsa::pkcs1::{
    DecodeRsaPrivateKey, DecodeRsaPublicKey, EncodeRsaPrivateKey, EncodeRsaPublicKey, LineEnding,
};
use rsa::{Pkcs1v15Encrypt, RsaPrivateKey, RsaPublicKey};

fn io_other<E: ToString>(err: E) -> io::Error {
    io::Error::other(err.to_string())
}

pub fn ensure_keypair(public_key_path: &Path, private_key_path: &Path) -> io::Result<()> {
    if public_key_path.exists() && private_key_path.exists() {
        return Ok(());
    }

    if let Some(parent) = public_key_path.parent() {
        fs::create_dir_all(parent)?;
    }

    let mut rng = OsRng;
    let private_key = RsaPrivateKey::new(&mut rng, 1024).map_err(io_other)?;
    let public_key = RsaPublicKey::from(&private_key);

    if !private_key_path.exists() {
        let private_pem = private_key
            .to_pkcs1_pem(LineEnding::LF)
            .map_err(io_other)?
            .to_string();
        fs::write(private_key_path, private_pem)?;
    }

    if !public_key_path.exists() {
        let public_pem = public_key
            .to_pkcs1_pem(LineEnding::LF)
            .map_err(io_other)?
            .to_string();
        fs::write(public_key_path, public_pem)?;
    }

    Ok(())
}

pub fn decrypt_base64_private(private_key_path: &Path, encrypted: &str) -> io::Result<String> {
    let private_pem = fs::read_to_string(private_key_path)?;
    let private_key = RsaPrivateKey::from_pkcs1_pem(&private_pem).map_err(io_other)?;
    let bytes = STANDARD.decode(encrypted).map_err(io_other)?;
    let decrypted = private_key
        .decrypt(Pkcs1v15Encrypt, &bytes)
        .map_err(io_other)?;
    String::from_utf8(decrypted).map_err(io_other)
}

pub fn encrypt_base64_public(public_key_path: &Path, value: &str) -> io::Result<String> {
    let public_pem = fs::read_to_string(public_key_path)?;
    let public_key = RsaPublicKey::from_pkcs1_pem(&public_pem).map_err(io_other)?;
    let mut rng = OsRng;
    let encrypted = public_key
        .encrypt(&mut rng, Pkcs1v15Encrypt, value.as_bytes())
        .map_err(io_other)?;
    Ok(STANDARD.encode(encrypted))
}
