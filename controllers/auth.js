const { response } = require("express");
const bycrypt = require('bcryptjs')
const { validationResult } = require("express-validator");
const Usuario = require("../models/Usuario");
const {generarjwt} = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe con este correo",
      });
    }
    usuario = new Usuario(req.body);
    // encriptar contraseña
    const salt = bycrypt.genSaltSync();
    usuario.password = bycrypt.hashSync(password,salt);


    await usuario.save();
    // generar jwt
    const token =  await generarjwt(usuario.id, usuario.name)


    res.status(201).json({
      ok: true,
      uid:usuario.id,
      name:usuario.name,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const loginUsuario = async(req, res = response) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese email",
      });
    }
    //confirmar los passwords
    const validPassword = bycrypt.compareSync(password,usuario.password)
    if(!validPassword){
      return res.status(400).json({
        ok:false,
        msg:'Password incorrecto'
      })
    }
 // generar nuestro jwt
 const token =  await generarjwt(usuario.id, usuario.name)
  
  res.json({
    ok:true,
    uid:usuario.id,
    name:usuario.name,
    token
  })


  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }

 
};

const revalidarToken = async(req, res = response) => {
  const uid = req.uid;
  const name = req.name;

  // generar un nuevo jwt y retonarlo en esta peticion
  const token = await generarjwt(uid, name)


  res.json({
    ok: true,
    token
  });
};

module.exports = { crearUsuario, loginUsuario, revalidarToken };
