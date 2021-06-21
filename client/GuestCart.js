
export function createGuestCart() {
    const guestCart = []
    if (!localStorage.getItem("guestCart")) {
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
    }
  }

export function fetchGuestCart() {
    const guestCart = JSON.parse(localStorage.getItem("guestCart"))
    return guestCart;
}

export function addToGuestCart(card) {
    let guestCart = JSON.parse(localStorage.getItem('guestCart'))
    guestCart.push(card)
    localStorage.guestCart = JSON.stringify(guestCart)
}

export function removeFromGuestCart(card) {
    let guestCart = JSON.parse(localStorage.getItem('guestCart'))
    let index = guestCart.indexOf(card)
    guestCart.splice(index, 1)
}

export function clearGuestCart() {
    const emptyGuestCart = []
    localStorage.guestCart = JSON.stringify(emptyGuestCart);
}