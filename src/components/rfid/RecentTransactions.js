import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, List, ListItem, ListItemText, Divider, Box, Grid, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { getTransactionData, getUserInfo } from '../api';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
    borderRadius: '15px',
    backgroundColor: theme.palette.background.default,
    boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
}));

const TransactionListItem = styled(ListItem)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(1),
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    setLoading(false);
                    return;
                }

                const userInfo = await getUserInfo(token);
                console.log('User Info:', userInfo); 

                const response = await getTransactionData({ user_id: userInfo.id });
                console.log('API Response:', response); 

                const transactionsData = response?.transaction;

                if (Array.isArray(transactionsData)) {
                    setTransactions(transactionsData);
                    generateChartData(transactionsData);
                } else {
                    console.error('Invalid data format:', transactionsData);
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const generateChartData = (transactions) => {
        if (!transactions || transactions.length === 0) {
            console.error('No transactions available for chart data');
            return;
        }
        // Sort transactions by date 
        transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
        const labels = transactions.map(transaction => new Date(transaction.date).toLocaleDateString());
        const data = transactions.map(transaction => parseFloat(transaction.amount));
        setChartData({
            labels,
            datasets: [
                {
                    label: 'Transaction Amount',
                    data,
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
                },
            ],
        });
    };
    
    return (
        <Container maxWidth="md">
            <StyledPaper elevation={3}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Recent Transactions
                </Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <List>
                                {transactions.length > 0 ? (
                                    transactions.slice(0, 4).map((transaction, index) => (
                                        <React.Fragment key={transaction.id}>
                                            <TransactionListItem>
                                                <ListItemText
                                                    primary={`Amount: ${transaction.amount} LKR`}
                                                    secondary={`Date: ${new Date(transaction.date).toLocaleString()}`}
                                                />
                                            </TransactionListItem>
                                            {index < transactions.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <Typography variant="body1" color="textSecondary">
                                        No transactions available.
                                    </Typography>
                                )}
                            </List>
                        </Grid>
                        <Grid item xs={12} md={6} >
                            {chartData.labels && chartData.labels.length > 0 ? (
                                <Box sx={{ height: '300px' }}>
                                    <Line data={chartData} options={{ maintainAspectRatio: false }} />
                                </Box>
                            ) : (
                                <Typography variant="body1" color="textSecondary">
                                    No chart data available.
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                )}
            </StyledPaper>
        </Container>
    );
};

export default Transactions;
