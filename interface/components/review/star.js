import { Rating } from 'react-simple-star-rating'

const Star = ({ gold = 0 }) => {
    return (
        <Rating
            initialValue={gold * 20}
            ratingValue={gold * 20}
            size={20}
            allowHover={false}
            readonly={true}
        />
    )
}

export default Star;