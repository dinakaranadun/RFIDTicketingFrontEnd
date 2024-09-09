import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import { createPaymentIntent,paymentSuccess,getUserInfo } from '../api';

const CheckoutForm = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [error, setError] = useState(null);
    const [paymentSucceeded, setPaymentSucceeded] = useState(false);

    useEffect(() => {
        const fetchClientSecret = async () => {
            try {
                const secret = await createPaymentIntent(amount);
                setClientSecret(secret);
            } catch (error) {
                console.error('Error fetching client secret:', error);
            }
        };

        fetchClientSecret();
    }, [amount]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            return;
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardNumberElement),
                billing_details: {
                },
            }
        });

        if (error) {
            setError(error.message);
        } else if (paymentIntent.status === 'succeeded') {
            setPaymentSucceeded(true);
            const handlePaymentSuccess = async () => {
                try {
                    const token = localStorage.getItem('token');
                    console.log('here');
                    if (token) {
                        const userInfo = await getUserInfo(token);
                        const response = await paymentSuccess({ user_id: userInfo.id, amount:amount });
        
                        if (response.success) {
                            console.log('User info:', userInfo);
                            console.log('Payment successful, credit updated.');
                        } else {
                            console.error('Payment succeeded, but credit update failed:', response.message);
                        }
                    }
                } catch (error) {
                    console.error('Error processing payment success:', error);
                }
            };
        
            handlePaymentSuccess();

            setTimeout(() => {
                window.location.reload(); 
              }, 1000);
            
        }

        
        
        
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#32325d',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#fa755a',
            },
        },
    };

    return (
        <div style={styles.formContainer}>
            <h2 style={styles.title}>Payment Information</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label}>Card Number</label>
                <div style={styles.inputWrapper}>
                    <CardNumberElement options={cardElementOptions} />
                </div>

                <label style={styles.label}>Expiration Date</label>
                <div style={styles.inputWrapper}>
                    <CardExpiryElement options={cardElementOptions} />
                </div>

                <label style={styles.label}>CVC</label>
                <div style={styles.inputWrapper}>
                    <CardCvcElement options={cardElementOptions} />
                </div>

                <button type="submit" disabled={!stripe || !elements || !clientSecret} style={styles.button}>
                    Pay Rs{amount}
                </button>
                {error && <div style={styles.error}>{error}</div>}
                {paymentSucceeded && <div style={styles.success}>Payment Succeeded!</div>}
            </form>
        </div>
    );
};

const styles = {
    formContainer: {
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#32325d',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: '16px',
        marginBottom: '10px',
        color: '#32325d',
    },
    inputWrapper: {
        padding: '10px',
        border: '1px solid #e2e8f0',
        borderRadius: '5px',
        marginBottom: '20px',
    },
    button: {
        backgroundColor: '#6772e5',
        color: '#ffffff',
        fontSize: '16px',
        padding: '10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
    },
    error: {
        color: '#fa755a',
        marginTop: '10px',
        textAlign: 'center',
    },
    success: {
        color: '#4caf50',
        marginTop: '10px',
        textAlign: 'center',
    },
};

export default CheckoutForm;
