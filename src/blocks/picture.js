import React, { Fragment } from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'

const slideImages = [
  'assets/pics/slides/slide_1.jpg',
  'assets/pics/slides/slide_2.jpg',
  'assets/pics/slides/slide_3.jpg',
  'assets/pics/slides/slide_4.jpg',
  'assets/pics/slides/slide_5.jpg',
  'assets/pics/slides/slide_6.jpg',
  'assets/pics/slides/slide_7.jpg',
  'assets/pics/slides/slide_8.jpg'
];

const slideProps = {
  autoPlay: true,
  infiniteLoop: true,
  showIndicators: true,
  showThumbs: false,
  showArrows: true,
  showStatus: false
}

const Picture = () => (
  <Fragment>
    <h2>Un objet de culture au design et au contenu distingué.</h2>
    <Carousel {...slideProps}>
      { slideImages.map((slideImg, index) => (
        <img key={`slide-${index}`} src={slideImg} alt="Memoprout Pad" /> 
      ))}
    </Carousel>
  </Fragment>
)

export default Picture