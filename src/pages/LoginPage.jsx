import { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import { loginUsuario, registrarUsuario } from "../services/AuthService";

const initialState = {
  nombre: "",
  apellido: "",
  email: "",
  password: "",
  telefono: "",
  rol: "PACIENTE",
  especialidad: "",
};

export function LoginPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setFormData(initialState);
  }, [isLogin]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const response = await loginUsuario({
          email: formData.email,
          password: formData.password,
        });
        Swal.fire(
          "Ingreso correcto",
          `Bienvenido ${response.data.nombreCompleto}`,
          "success",
        );
        onLoginSuccess(response.data);
      } else {
        const payload = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          password: formData.password,
          telefono: formData.telefono,
          rol: formData.rol,
          especialidad:
            formData.rol === "PSICOLOGO" ? formData.especialidad : null,
        };
        const response = await registrarUsuario(payload);
        Swal.fire(
          "Usuario creado",
          "La cuenta fue registrada correctamente. Ahora puedes iniciar sesion.",
          "success",
        );
        setIsLogin(true);
        onLoginSuccess(response.data);
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message ||
          error.response?.data ||
          "No fue posible completar la solicitud.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #082f49 0%, #0f766e 45%, #f8fafc 100%)",
        display: "grid",
        placeItems: "center",
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          sx={{
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(8, 47, 73, 0.30)",
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }}>
            <Box
              sx={{
                flex: 1,
                p: { xs: 4, md: 5 },
                background: "linear-gradient(160deg, #082f49, #0f172a)",
                color: "white",
              }}
            >
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{ mt: 1, mb: 2, textAlign: "-khtml-left" }}
              >
                Sistema de agendamiento para psicología
              </Typography>
              <Typography
                sx={{ opacity: 0.86, maxWidth: 400, textAlign: "justify" }}
              >
                Registro por roles, agenda personalizada, historia clínica y
                seguimiento de citas con trazabilidad para avisos por WhatsApp.
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 4 }}>
                <Alert severity="info" sx={{ borderRadius: 3 }}>
                  Administrador: controla usuarios y operación general.
                </Alert>
                <Alert severity="success" sx={{ borderRadius: 3 }}>
                  Psicólogo: gestiona pacientes, historia clínica y agenda.
                </Alert>
                <Alert severity="warning" sx={{ borderRadius: 3 }}>
                  Paciente: consulta y agenda sus citas.
                </Alert>
              </Stack>
            </Box>

            <Box
              sx={{
                flex: 1,
                p: { xs: 4, md: 5 },
                backgroundColor: "rgba(255,255,255,0.95)",
              }}
            >
              <Typography variant="h4" fontWeight={800}>
                {isLogin ? "Iniciar sesion" : "Crear usuario"}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {isLogin
                  ? "Accede con tu correo y contraseña."
                  : "Selecciona el rol correcto al crear el usuario."}
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  {!isLogin ? (
                    <>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                      >
                        <TextField
                          name="nombre"
                          label="Nombre"
                          required
                          fullWidth
                          value={formData.nombre}
                          onChange={handleChange}
                        />
                        <TextField
                          name="apellido"
                          label="Apellido"
                          required
                          fullWidth
                          value={formData.apellido}
                          onChange={handleChange}
                        />
                      </Stack>
                      <TextField
                        name="telefono"
                        label="Teléfono"
                        required
                        fullWidth
                        value={formData.telefono}
                        onChange={handleChange}
                      />
                      <FormControl fullWidth>
                        <InputLabel>Rol</InputLabel>
                        <Select
                          name="rol"
                          label="Rol"
                          value={formData.rol}
                          onChange={handleChange}
                        >
                          <MenuItem value="PACIENTE">Paciente</MenuItem>
                        </Select>
                      </FormControl>
                      {formData.rol === "PSICOLOGO" ? (
                        <TextField
                          name="especialidad"
                          label="Especialidad"
                          required
                          fullWidth
                          value={formData.especialidad}
                          onChange={handleChange}
                        />
                      ) : null}
                    </>
                  ) : null}

                  <TextField
                    name="email"
                    label="Correo electrónico"
                    type="email"
                    required
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <TextField
                    name="password"
                    label="Contraseña"
                    type={showPassword ? "text" : "password"}
                    required
                    fullWidth
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value.replace(/\s/g, ""),
                      })
                    }
                    error={
                      formData.password &&
                      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/.test(
                        formData.password,
                      )
                    }
                    helperText="Debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial."
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ py: 1.6, borderRadius: 3 }}
                  >
                    {loading
                      ? "Procesando..."
                      : isLogin
                        ? "Ingresar"
                        : "Registrar y entrar"}
                  </Button>

                  <Typography textAlign="center" color="text.secondary">
                    {isLogin
                      ? "Si aun no tienes cuenta"
                      : "Si ya tienes cuenta"}{" "}
                    <Link
                      component="button"
                      type="button"
                      onClick={() => setIsLogin((current) => !current)}
                      underline="hover"
                    >
                      {isLogin ? "registrate aquí" : "inicia sesion aquí"}
                    </Link>
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
