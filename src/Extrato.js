import React from 'react';
import { Box, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination, Divider } from '@mui/material';
import { format } from 'date-fns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Title from './Title';

const Extrato = () => {
  const [dataInicio, setDataInicio] = React.useState('');
  const [dataFim, setDataFim] = React.useState('');
  const [nomeOperador, setNomeOperador] = React.useState('');
  const [saldoTotal, setSaldoTotal] = React.useState(0);
  const [saldoPeriodo, setSaldoPeriodo] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dados, setDados] = React.useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePesquisar = () => {
    const url = `http://localhost:8080/extrato`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const transacoesPeriodo = data.filter(registro => {
            const dataTransacao = new Date(registro.dataTransferencia);
            return (!dataInicio || dataTransacao >= new Date(dataInicio)) && (!dataFim || dataTransacao <= new Date(dataFim));
          });
        const saldoTotal = data.reduce((acc, registro) => acc + registro.valor, 0);
        const saldoPeriodo = transacoesPeriodo.reduce((acc, registro) => acc + registro.valor, 0);
        setSaldoTotal(saldoTotal);
        setSaldoPeriodo(saldoPeriodo);
        setDados(transacoesPeriodo);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <React.Fragment>
        <Title>Extrato</Title>
        <Box>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Data de início" value={dataInicio} onChange={(event) => setDataInicio(event.target.value)} />
                        <DatePicker label="Data de fim" value={dataFim} onChange={(event) => setDataFim(event.target.value)} />
                    </LocalizationProvider>
                    <TextField label="Nome operador transacionado" value={nomeOperador} onChange={(event) => setNomeOperador(event.target.value)} />
                </Box>
                <Button variant="contained" onClick={handlePesquisar}>Pesquisar</Button>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={4} align="center">Saldos</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Saldo Total: </TableCell>
                        <TableCell align="right">{saldoTotal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Saldo no Período:</TableCell>
                        <TableCell align="right">{saldoPeriodo.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={4}>
                            <Divider />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Data</TableCell>
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Valor</TableCell>
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Tipo</TableCell>
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Nome operador transacionado</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((registro) => (
                        <TableRow key={registro.id}>
                            <TableCell align="center">{format(new Date(registro.dataTransferencia), 'dd/MM/yyyy')}</TableCell>
                            <TableCell align="center">{registro.valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
                            <TableCell align="center">{registro.tipo}</TableCell>
                            <TableCell align="center">{registro.nomeOperador}</TableCell>
                        </TableRow>
                    ))} 
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                        rowsPerPageOptions={[10, 25, { label: 'All', value: -1 }]}
                        count={dados.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </Box>
    </React.Fragment>
  );
};

export default Extrato;