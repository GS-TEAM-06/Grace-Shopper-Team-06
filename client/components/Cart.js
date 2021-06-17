import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCart } from "../store/cart";

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
    console.log("order items?->", this.props.cart);
    // let orderItems = this.props.cart.orderItems.length ? (
    //   this.props.cards.map((card) => {
    //     return (
    //       <div>
    //         <li key={card.id}>
    //           <div>
    //             <img src={card.imgUrl} />
    //           </div>
    //           <Link to={`/cards/${card.id}`}>
    //             <p>{card.name}</p>
    //           </Link>
    //           <p>{card.description}</p>
    //           <p>{card.price}</p>
    //         </li>
    //         <div>
    //           <form>
    //             <div onClick={this.handleDecreaseQuantity}>-</div>
    //             <input value="1" />
    //             <div onClick={this.handleIncreaseQuantity}>+</div>
    //           </form>
    //         </div>
    //       </div>
    //     );
    //   })
    // ) : (
    //   <p>Nothing</p>
    // );

    return (
      <div>
        <h5>You have ordered:</h5>
        <ul></ul>
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
  };
};

export default connect(mapState, mapDispatch)(Cart);
