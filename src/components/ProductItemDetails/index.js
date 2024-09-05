import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    itemDetails: {},
    count: 1,
  }

  componentDidMount() {
    this.getItemDetails()
  }

  getItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})

    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const formattedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products.map(eachItem => ({
          id: eachItem.id,
          imageUrl: eachItem.image_url,
          title: eachItem.title,
          style: eachItem.style,
          price: eachItem.price,
          description: eachItem.description,
          brand: eachItem.brand,
          totalReviews: eachItem.total_reviews,
          rating: eachItem.rating,
          availability: eachItem.availability,
        })),
      }

      this.setState({
        itemDetails: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoading = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="error-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-image"
      />
      <h1>Product Not Found</h1>
      <button
        type="button"
        className="shopping-button prod-star-container"
        onClick={() => {
          this.props.history.push('/products')
        }}
      >
        Continue Shopping
      </button>
    </div>
  )

  decrementCounter = () => {
    this.setState(prevState => ({
      count: prevState.count > 1 ? prevState.count - 1 : prevState.count,
    }))
  }

  incrementCounter = () =>
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))

  renderProductsView = () => {
    const {itemDetails, count} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
      similarProducts,
    } = itemDetails

    return (
      <>
        <div className="products-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div>
            <h1>{title}</h1>
            <p>Rs {price}/-</p>
            <div className="reviews-container">
              <div className="shopping-button prod-star-container">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="stars"
                  className="stars-image"
                />
              </div>
              <p>{totalReviews}</p>
            </div>
            <p>{description}</p>
            <p>
              <span>Available: </span>
              {availability}
            </p>
            <p>
              <span>Brand: </span>
              {brand}
            </p>
            <hr />
            <div className="cart-count-container">
              <button
                data-testid="minus"
                type="button"
                className="transparent"
                onClick={this.decrementCounter}
              >
                <BsDashSquare />
              </button>

              <p>{count}</p>
              <button
                className="transparent"
                data-testid="plus"
                onClick={this.incrementCounter}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button
              type="button"
              className="shopping-button prod-star-container"
            >
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1>Similar Products</h1>
          <div className="similar-product-container">
            {similarProducts.map(eachItem => (
              <SimilarProductItem details={eachItem} key={eachItem.id} />
            ))}
          </div>
        </div>
      </>
    )
  }

  renderFinalView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.loading:
        return this.renderLoading()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderFinalView()}
      </>
    )
  }
}

export default ProductItemDetails
