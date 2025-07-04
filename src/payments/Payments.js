import { useDispatch, useSelector } from 'react-redux'
import { CREDITS_PACKS } from '../config/payments';
import { useState } from 'react';
import axios from 'axios';
import { serverEndpoint } from '../config/config'
import { SET_USER } from '../redux/user/actions'
import 'bootstrap/dist/css/bootstrap.min.css';

function ManagePayments() {
    const user = useSelector((state) => state.userDetails);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handlePayment = async (credits) => {
        try {
            const createOrderResponse = await axios.post(`${serverEndpoint}/payments/create-order`, {
                credits: credits
            }, {
                withCredentials: true
            });
            const order = createOrderResponse.data.order;
            const option = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'Affiliate++',
                description: `${credits} credits pack`,
                order_id: order.id,
                theme: {
                    color: '#3399cc'
                },
                handler: async (payment) => {
                    try {
                        const response = await axios.post(`${serverEndpoint}/payments/verify-order`, {
                            razorpay_order_id: payment.razorpay_order_id,
                            razorpay_payment_id: payment.razorpay_payment_id,
                            razorpay_signature: payment.razorpay_signature,
                            credits
                        }, {
                            withCredentials: true
                        });
                        console.log(response.data.user);
                        dispatch({
                            type: SET_USER,
                            payload: response.data.user
                        });
                        setMessage('Credits added Seccessfully');
                    } catch (error) {
                        console.log(error);
                        setErrors({
                            message: 'Unable to verify payment, if the money gets deducted, reach out to customer service'
                        });
                    }
                },
            };

            const razorpayPopup = new window.Razorpay(option);
            razorpayPopup.open();
        } catch (error) {
            console.log(error);
            setErrors({
                message: 'Unable to create order, please try again'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            {message && (
                <div className="alert alert-success" role="alert">
                    {message}
                </div>
            )}
            {errors.message && (
                <div className="alert alert-danger" role="alert">
                    {errors.message}
                </div>
            )}

            <div className="text-center mb-4">
                <h2 className="fw-bold">Manage Payments</h2>
                <p><strong>Credit Balance:</strong> {user.credits}</p>
            </div>

            <div className="row justify-content-center">
                {CREDITS_PACKS.map((credit) => (
                    <div key={credit} className="col-md-4 col-sm-6 mb-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body text-center">
                                <h4 className="card-title">{credit} Credits</h4>
                                <p className="card-text">Buy {credit} Credits For ₹{credit}</p>
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => handlePayment(credit)}
                                    disabled={loading}
                                >
                                    Pay
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ManagePayments;
