import React, { useState, useEffect } from 'react';
import { listarCitas, guardarCita, eliminarCita } from '../services/CitaService';
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';

export const CitasPage = () => {
  const [citas, setCitas] = useState([]);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  // Cargar citas al iniciar
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      console.log("📥 Solicitando listado de citas al backend...");
      const resp = await listarCitas();
      console.log("✅ Citas recibidas:", resp.data);
      setCitas(resp.data);
    } catch (error) {
      console.error("❌ Error al conectar con Java al listar citas:", error);
      console.error("Detalle de error (response):", error.response?.data);
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    // Construcción del objeto que se envía al backend
    const nuevaCita = {
      fecha,                     // Ej: "2025-11-28"
      hora: `${hora}:00`,        // Ej: "11:40:00" para hora local
      estado: "Pendiente",
      idPaciente: 1,      // Confirmado: ID 1 existe en tu BD
      idPsicologo: 1,     // Confirmado: ID 1 existe en tu BD
      idServicio: 1       // Confirmado: ID 1 existe en tu BD
    };

    console.log("📝 Enviando cita:", nuevaCita);

    try {
      const resp = await guardarCita(nuevaCita);
      console.log("✅ Respuesta del backend:", resp.data);
      Swal.fire("¡Éxito!", "Cita guardada correctamente", "success");

      // Limpiar y recargar
      setFecha("");
      setHora("");
      cargarDatos();
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      Swal.fire("Error", "No se pudo guardar. Revisa la consola (Terminal Java).", "error");
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarCita(id);
      Swal.fire("Eliminado", "Cita borrada", "success");
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Gestión de Citas
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleGuardar}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />
            <TextField
              label="Hora"
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />
            <Button variant="contained" type="submit" sx={{ px: 4, minWidth: '150px' }}>
              Agendar
            </Button>
          </Box>
        </form>
      </Paper>

      <Paper>
        <Table>
          <TableHead sx={{ bgcolor: '#1976d2' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Fecha</TableCell>
              <TableCell sx={{ color: 'white' }}>Hora</TableCell>
              <TableCell sx={{ color: 'white' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white' }}>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {citas.map((cita) => (
              <TableRow key={cita.idCita}>
                <TableCell>{cita.idCita}</TableCell>
                <TableCell>{cita.fecha}</TableCell>
                <TableCell>{cita.hora}</TableCell>
                <TableCell>{cita.estado}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleEliminar(cita.idCita)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};