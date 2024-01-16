import { useState } from "react";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { Gallery } from "react-grid-gallery";

const client = new S3Client({ region: "ap-south-1" });

export default function ImagePicker(props) {
  //console.log(props)
  const eventImages = [];
  props.images.map((image) => {
    eventImages.push({
      src: `https://construction-network-bucket.s3.ap-south-1.amazonaws.com/${image}`,
      width: 400,
      height: 400,
      thumbnailCaption: `${image}`,
      key: image,
    });
  });
  // console.log(eventImages)
  const [images, setImages] = useState(eventImages);
  const hasSelected = images.some((image) => image.isSelected);

  const handleSelect = (index, item, event) => {
    if (!hasSelected) {
      const nextImages = images.map((image, i) =>
        i === index ? { ...image, isSelected: true } : image
      );
      setImages(nextImages);
      // getSelectedImage(index);
    }
    if (hasSelected) {
      const nextImages = images.map((image, i) =>
        i === index ? { ...image, isSelected: false } : image
      );
      setImages(nextImages);
    }

    props.showLink(!item.isSelected);
    if(!item.isSelected) {
      props.getImageKey(item.key);
    }

    //console.log(nextImages)
    //console.log(index);
  };

  // const handleSelectAllClick = () => {
  //   const nextImages = images.map((image) => ({
  //     ...image,
  //     isSelected: !hasSelected,
  //   }));
  //   setImages(nextImages);
  // };

  //console.log(hasSelected);
  // const getSelectedImage = (index) => {
  //   props.getImageKey(eventImages[index].key);
  //   //console.log(eventImages[index].key);
  // };

  //console.log(images)

  return (
    <div>
      {/* <div className="p-t-1 p-b-1">
        <button onClick={handleSelectAllClick}>
          {hasSelected ? "Clear selection" : "Select all"}
        </button>
      </div> */}
      <Gallery
        images={images}
        onSelect={handleSelect}
        onClick={handleSelect}
        margin={"5px"}
      />
    </div>
  );
}
