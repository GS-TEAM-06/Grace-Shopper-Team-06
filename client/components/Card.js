import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchCard } from "../store/card";
import { addedToCart } from "../store/cart";

class Card extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.fetchCard(id);
  }

  handleClick(event) {
    console.log("does this work?");
    const usersId = this.props.user.id;
    const cardId = event.target.value;

    this.props.addedToCart(usersId, cardId);
  }

  render() {
    console.log("card props ->", this.props);
    const { singleCard, user } = this.props;
    return (
      <div>
        <h3>{singleCard.name}</h3>
        {/* <h3>{singleCard.quantity}</h3> */}
        <img src={singleCard.imageUrl} />
        <h6>{singleCard.description}</h6>
        <h3>{singleCard.price}</h3>
        <button type="button" value={singleCard.id} onClick={this.handleClick}>
          Add To Cart
        </button>
      </div>
    );
  }
}

const mapState = (state) => {
  console.log("card state->", state);
  return {
    singleCard: state.card,
    user: state.auth,
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchCard: (id) => dispatch(fetchCard(id)),
    addedToCart: (userId, cardId) => dispatch(addedToCart(userId, cardId)),
  };
};

export default connect(mapState, mapDispatch)(Card);
