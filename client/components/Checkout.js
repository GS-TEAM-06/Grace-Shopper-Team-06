import { CardContent } from '@material-ui/core';
import { TransferWithinAStationOutlined } from '@material-ui/icons';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCart } from '../store/cart';
import { me } from '../store/auth';

class Checkout extends Component {
  // constructor(props) {
  //   super(props);
  // }
  async componentDidMount() {
    await this.props.setAuth();
    console.log('this.props -->', this.props);
    this.props.fetchCart(this.props.user.id);
  }

  render() {
    const { orderItems } = this.props.cart;
    console.log('this is cart ->', this.props.cart);
    console.log('userId -->', this.props.user.id);
    if (typeof orderItems === 'undefined') {
      return <div>loading...</div>;
    } else {
      return (
        <div>
          {orderItems.map((objectItem) => {
            return (
              <div key={objectItem.card.id}>
                <img src={objectItem.card.imgUrl} />
                <Link to={`/cards/${objectItem.card.id}`}>
                  <p>Name: {objectItem.card.name}</p>
                </Link>
                <p>Quantity: {objectItem.quantity}</p>
              </div>
            );
          })}
          <div>Payment</div>
          <h3>Order Summary</h3>
          <div>Total: {'$' + (this.props.cart.total / 100).toFixed(2)}</div>
          <p>
            <button>Place your order</button>
          </p>
        </div>
      );
    }
  }
}

const mapState = (state) => {
  return {
    cart: state.cart,
    user: state.auth,
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchCart: (userId) => dispatch(fetchCart(userId)),
    setAuth: () => dispatch(me()),
  };
};

export default connect(mapState, mapDispatch)(Checkout);
