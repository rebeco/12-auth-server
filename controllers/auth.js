const { request, response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req = request, res = response) => {
  const { email, name, password } = req.body;

  try {
    // Verificamos que no existe el email
    const usuario = await Usuario.findOne({ email: email });
    console.log(usuario);

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario ya existe en la BD',
      });
    }

    // Creamos el usuario con nuestro modelo
    const dbUser = new Usuario(req.body);

    // Encriptamos la contraseña
    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync(password, salt);

    // Crear el usuario en la BD
    await dbUser.save();

    // Generar el JWT
    const token = await generarJWT(dbUser.id, name);

    // Generar la respuesta exitosa
    return res.status(201).json({
      ok: true,
      uid: dbUser.id,
      name: name,
      token: token,
      email: email,
    });

    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error en la creación de usuario',
    });
  }
};

const loginUsuario = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    const dbUser = await Usuario.findOne({ email: email });

    if (!dbUser) {
      return res.status(400).json({
        ok: false,
        msg: 'El correo no existe',
      });
    }

    const validPass = bcrypt.compareSync(password, dbUser.password);

    if (!validPass) {
      return res.status(400).json({
        ok: false,
        msg: 'La contraseña no es correcta',
      });
    }

    // Generamos el JWT
    const token = await generarJWT(dbUser.id, dbUser.name);

    return res.json({
      ok: true,
      uid: dbUser.id,
      name: dbUser.name,
      token: token,
      email: dbUser.email,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

const revalidarToken = async (req = request, res = response) => {
  const { uid } = req;

  const dbUser = await Usuario.findById(uid);

  const token = await generarJWT(uid, dbUser.name);
  return res.json({
    ok: true,
    uid: uid,
    name: dbUser.name,
    email: dbUser.email,
    token: token,
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
