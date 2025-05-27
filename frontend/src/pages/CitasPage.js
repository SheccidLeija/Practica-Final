import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Grid, Card, CardContent,
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Box, Chip, Avatar,
  Divider, Paper, IconButton, Fade, Slide
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Pets as PetsIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import api from '../services/api';
import '../styles/citas.css';

const CitasPage = () => {
  const [citas, setCitas] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ fecha: '', motivo: '', mascota_id: '' });
  const [selectedId, setSelectedId] = useState(null);

  const fetchCitas = async () => {
    const res = await api.get('/citas');
    setCitas(res.data);
  };

  const fetchMascotas = async () => {
    const res = await api.get('/mascotas');
    setMascotas(res.data);
  };

  useEffect(() => {
    fetchCitas();
    fetchMascotas();
  }, []);

  const handleOpen = () => {
    setEditMode(false);
    setFormData({ fecha: '', motivo: '', mascota_id: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
  };

  const handleSubmit = async () => {
    try {
      const data = { ...formData, mascota_id: Number(formData.mascota_id) };
      if (editMode) {
        await api.put(`/citas/${selectedId}`, data);
      } else {
        await api.post('/citas', data);
      }
      fetchCitas();
      handleClose();
    } catch (err) {
      console.error(err);
      alert('Error al guardar la cita');
    }
  };

  const handleEdit = (cita) => {
    setEditMode(true);
    setFormData({
      fecha: cita.fecha,
      motivo: cita.motivo,
      mascota_id: cita.mascota_id
    });
    setSelectedId(cita.id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta cita?')) {
      await api.delete(`/citas/${id}`);
      fetchCitas();
    }
  };

  const getMascotaNombre = (id) => {
    const mascota = mascotas.find((m) => m.id === id);
    return mascota ? mascota.nombre : `ID: ${id}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }),
      time: date.toLocaleTimeString('es-ES', {
        hour: '2-digit', minute: '2-digit'
      })
    };
  };

  const getStatusColor = (fecha) => {
    const now = new Date();
    const citaDate = new Date(fecha);
    const diffHours = (citaDate - now) / (1000 * 60 * 60);
    if (diffHours < 0) return 'error';
    if (diffHours < 24) return 'warning';
    return 'success';
  };

  const getStatusText = (fecha) => {
    const now = new Date();
    const citaDate = new Date(fecha);
    const diffHours = (citaDate - now) / (1000 * 60 * 60);
    if (diffHours < 0) return 'Completada';
    if (diffHours < 24) return 'Próxima';
    return 'Programada';
  };

  return (
    <Container maxWidth="lg" className="container">
      <Paper elevation={0} className="headerPaper">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar className="headerAvatar">
              <CalendarIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Gestión de Citas
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                {citas.length} citas registradas
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            className="newCitaButton"
          >
            Nueva Cita
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {citas.map((cita, index) => {
          const { date, time } = formatDate(cita.fecha);
          return (
            <Grid item xs={12} md={6} lg={4} key={cita.id}>
              <Fade in timeout={300 + index * 100}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    },
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2} className="cardActions">
                      <Chip
                        label={getStatusText(cita.fecha)}
                        color={getStatusColor(cita.fecha)}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                      <Box display="flex" gap={1}>
                        <IconButton onClick={() => handleEdit(cita)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(cita.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <CalendarIcon color="primary" fontSize="small" />
                      <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                        {date}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={3}>
                      <TimeIcon color="primary" fontSize="small" />
                      <Typography variant="h6" fontWeight="bold">
                        {time}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}>
                        <PetsIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Mascota
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {getMascotaNombre(cita.mascota_id)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="flex-start" gap={2}>
                      <DescriptionIcon color="action" fontSize="small" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Motivo
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {cita.motivo}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          );
        })}
      </Grid>

      {citas.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: 'grey.50',
            borderRadius: 3,
            border: '2px dashed',
            borderColor: 'grey.300'
          }}
        >
          <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, mx: 'auto', mb: 2 }}>
            <CalendarIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" gutterBottom fontWeight="medium">
            No hay citas programadas
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Comienza agregando tu primera cita médica
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Crear Primera Cita
          </Button>
        </Paper>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar className="dialogAvatar">
              {editMode ? <EditIcon /> : <AddIcon />}
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              {editMode ? 'Editar Cita' : 'Nueva Cita'}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Fecha y Hora"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={formData.fecha}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Motivo de la consulta"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={formData.motivo}
            onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
          />

          <TextField
            select
            label="Seleccionar Mascota"
            fullWidth
            margin="normal"
            value={formData.mascota_id}
            onChange={(e) => setFormData({ ...formData, mascota_id: e.target.value })}
          >
            {mascotas.map((mascota) => (
              <MenuItem key={mascota.id} value={mascota.id}>
                <Box display="flex" alignItems="center" gap={2}>
                  <PetsIcon color="primary" fontSize="small" />
                  {mascota.nombre}
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2, px: 3 }}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2, px: 3 }}>
            {editMode ? 'Actualizar' : 'Crear Cita'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CitasPage;
