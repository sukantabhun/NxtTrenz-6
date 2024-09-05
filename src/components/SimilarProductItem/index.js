import './index.css'

const SimilarProductItem = props => {
  const {details} = props
  const {imageUrl, title, price, brand, rating} = details

  return (
    <div className="div-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-item-image"
      />
      <h1>{title}</h1>
      <p>by {brand}</p>
      <div className="item-details">
        <p>
          <span>Rs {price}/-</span>
        </p>
        <div className="shopping-button prod-star-container">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="stars"
            className="stars-image"
          />
        </div>
      </div>
    </div>
  )
}

export default SimilarProductItem
