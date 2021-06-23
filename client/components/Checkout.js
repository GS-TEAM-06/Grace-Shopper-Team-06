import { CardContent } from "@material-ui/core";
import { TransferWithinAStationOutlined } from "@material-ui/icons";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCart } from "../store/cart";

class Checkout extends Component {
  // constructor(props) {
  //   super(props);
  // }
  componentDidMount() {
    let userId = this.props.user.id;
    console.log("this.props.user -->", this.props.user);
    this.props.fetchCart(userId);
  }

  render() {
    //   const { orderItems } = this.props.cart;
    //   console.log("this is cart ->", orderItems);
    //   console.log("userId -->", this.props.user.id);
    return (
      // const { orderItems } = this.props.cart;
      // orderItems.map((objectItem) => {
      //     <div key={objectItem.card.id}>
      //       <div>
      //         <img src={objectItem.card.imgUrl} />

      //         <Link to={`/cards/${objectItem.card.id}`}>
      //           <p>Name: {objectItem.card.name}</p>
      //         </Link>
      //         <p>Description: {objectItem.card.description}</p>
      //         <p>Price: {objectItem.card.price}</p>
      //         <p>Quantity: {objectItem.quantity}</p>

      //         <button value={objectItem.cardId} onClick={this.handleAdd}>
      //           +
      //         </button>
      //         <button value={objectItem.cardId} onClick={this.handleRemove}>
      //           -
      //         </button>
      //       </div>
      //     </div>
      //   );
      // });
      <div>Hello</div>
    );
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
  };
};

export default connect(mapState, mapDispatch)(Checkout);
