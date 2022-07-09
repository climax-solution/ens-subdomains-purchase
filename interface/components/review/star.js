import { Rating } from 'react-simple-star-rating'

const Star = ({ gold = 0 }) => {
    return (
        <Rating
            initialValue={gold}
            ratingValue={gold}
            size={20}
            allowHover={false}

        />
    )
}

export default Star;