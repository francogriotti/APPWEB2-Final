import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const usuarioSchema = new mongoose.Schema(
  {
    id_usuario: {
      type: Number,
      unique: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    apellido: {
      type: String,
      required: true,
    },
    direccion: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contraseña: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Plugin para autoincrementar id_usuario
usuarioSchema.plugin(AutoIncrement, {
  inc_field: "id_usuario",
  start_seq: 1,
});

export default mongoose.model("Usuario", usuarioSchema);