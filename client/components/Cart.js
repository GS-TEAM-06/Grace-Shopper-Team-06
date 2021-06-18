import { CardContent } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCart } from "../store/cart";
import { removedFromCart } from "../store/cart";

class Cart extends Component {
  constructor() {
    super();
    this.handleDecreaseQuantity = this.handleDecreaseQuantity.bind(this);
    this.handleIncreaseQuantity = this.handleIncreaseQuantity.bind(this);
  }

  componentDidMount() {
    //need to get userId
    let userId = this.props.userId;
    this.props.fetchCart(userId);
  }

  handleIncreaseQuantity() {}

  handleDecreaseQuantity() {}

  render() {
    const { orderItems } = this.props.cart;
    const hasOrderItems = orderItems && orderItems.length;
    console.log("order items?->", orderItems);
    let items = hasOrderItems ? (
      orderItems.map((objectItem) => {
        return (
          <div key={objectItem.card.id}>
            <li>
              <div>
                <img src={objectItem.card.imgUrl} />
              </div>
              <Link to={`/cards/${objectItem.card.id}`}>
                <p>{objectItem.card.name}</p>
              </Link>
              <p>{objectItem.card.description}</p>
              <p>{objectItem.card.price}</p>
            </li>
            {/* <div>
              <form>
                <div onClick={this.handleDecreaseQuantity}>-</div>
                <input value="1" />
                <div onClick={this.handleIncreaseQuantity}>+</div>
              </form>
            </div> */}
          </div>
        );
      })
    ) : (
      <p>Nothing</p>
    );

    return (
      <div>
        <h5>You have ordered:</h5>
        <ul>{items}</ul>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    cart: state.cart,
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchCart: (userId) => dispatch(fetchCart(userId)),
    removedFromCart: (userId, cardId) => dispatch(removedFromCart(userId, cardId)),
  };
};

export default connect(mapState, mapDispatch)(Cart);
