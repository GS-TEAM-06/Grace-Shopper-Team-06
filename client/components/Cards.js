import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchCards} from "../store/cards";
import {addedToCart} from "../store/cart";
import {deleteCardThunk} from "../store/card";
import {Link} from "react-router-dom";
import Home from "./Home";
import axios from "axios";
import CreateCard from "./CreateCard";
import {withStyles} from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Button,
  Typography,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from "@material-ui/core";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 460,
    width: 260,
  },
  card: {
    height: 260,
    width: 180,
  },
  control: {
    padding: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

class Cards extends Component {
  constructor(props) {
    super(props);

    this.state = {category: "all", addQty: {}};

    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.categoryChange = this.categoryChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchCards(this.state.category);
  }

  async addToGuestCart(cardId, cardQty) {
    if (!cardQty) {
      cardQty = 1;
    }
    cardQty = Number(cardQty);
    const {data} = await axios.get(`/api/cards/${cardId}`);
    let guestCart = JSON.parse(localStorage.getItem("guestCart"));
    let guestCartId = guestCart.map((card) => card.id);
    let index = guestCartId.indexOf(data.id);
    if (index === -1) {
      data.quantity = cardQty;
      guestCart.push(data);
    } else {
      guestCart[index].quantity = Number(guestCart[index].quantity) + cardQty;
    }
    localStorage.guestCart = JSON.stringify(guestCart);
  }

  handleClick(event) {
    event.preventDefault();
    const cardsId = event.target.value;
    if (this.state.addQty[cardsId] == 0) return;
    if (this.props.user.id) {
      const usersId = this.props.user.id;
      const cardsId = event.currentTarget.value;
      this.props.addedToCart(usersId, cardsId, this.state.addQty[cardsId]);
    } else {
      this.addToGuestCart(
        event.currentTarget.value,
        this.state.addQty[cardsId]
      );
    }
  }

  handleSubmit(event, CardId) {
    console.log(event);
    event.preventDefault();
    this.props.deleteCard(CardId);
    this.props.fetchCards(this.state.category);
  }

  categoryChange(event) {
    event.preventDefault();
    this.setState({category: event.target.value});
    this.props.fetchCards(event.target.value);
  }

  handleQtyChange(event, cardId) {
    this.setState({addQty: {...{[cardId]: event.target.value}}});
  }

  render() {
    const {classes} = this.props;
    const {isLoggedIn} = this.props;
    const {user} = this.props;
    const {cards} = this.props;
    return (
      <div>
        <div>
          {isLoggedIn ? (
            <div>
              <Home />
            </div>
          ) : (
            <div>
              <h2>Welcome, Guest</h2>
            </div>
          )}
        </div>
        {isLoggedIn && user.admin ? (
          <div>
            <h3>CREATE NEW CARD</h3>
            <CreateCard history={this.props.history} />
          </div>
        ) : (
          <div />
        )}
        <FormControl className={classes.formControl}>
          <InputLabel id="select-category">Category</InputLabel>
          <Select
            labelId="category"
            id="category"
            value={this.state.category}
            onChange={this.categoryChange}
          >
            <MenuItem value="all">All categories</MenuItem>
            <MenuItem value="Magic: The Gathering">
              Magic: The Gathering
            </MenuItem>
            <MenuItem value="Pokemon">Pokemon</MenuItem>
            <MenuItem value="Yu-Gi-Oh!">Yu-Gi-Oh!</MenuItem>
          </Select>
        </FormControl>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={2}>
              {cards.map((card) => {
                return (
                  <Grid key={card.id} item>
                    <Paper className={classes.paper}>
                      <Grid
                        container
                        direction="column"
                        justify="space-around"
                        alignItems="center"
                      >
                        <Typography>
                          <Link to={`/cards/${card.id}`}>{card.name}</Link>
                        </Typography>
                        <img className={classes.card} src={card.imageUrl} />
                        <h5>{"$" + (card.price / 100).toFixed(2)}</h5>
                        <input
                          type="text"
                          size="1"
                          value={
                            !this.state.addQty[card.id]
                              ? 1
                              : this.state.addQty[card.id]
                          }
                          onChange={(event) =>
                            this.handleQtyChange(event, card.id)
                          }
                        />
                        <Button
                          item="true"
                          variant="contained"
                          color="primary"
                          value={card.id}
                          onClick={this.handleClick}
                          disabled={this.props.cartStatus === 'LOADING'}
                        >
                          Add To Cart
                        </Button>
                        {user.admin ? (
                          <Button
                            item="true"
                            variant="contained"
                            color="secondary"
                            type="submit"
                            className="remove"
                            onClick={(event) =>
                              this.handleSubmit(event, card.id)
                            }
                          >
                            Delete
                          </Button>
                        ) : (
                          <div />
                        )}
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    cards: state.cards,
    user: state.auth,
    cartStatus: state.cartStatus,
  };
};

const mapDispatch = (dispatch, {history}) => {
  return {
    addedToCart: (userId, cardId, qty) =>
      dispatch(addedToCart(userId, cardId, qty)),
    fetchCards: (category) => dispatch(fetchCards(category)),
    deleteCard: (cardId) => dispatch(deleteCardThunk(cardId)),
  };
};

export default withStyles(styles)(connect(mapState, mapDispatch)(Cards));
