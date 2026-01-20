import { useState, useEffect } from 'react';

const BadgeImage = ({ src, alt, className }) => {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        setImgSrc(src);
    }, [src]);

    const handleError = () => {
        // Prevent infinite loop if default image is also missing
        if (imgSrc !== '/images/badges/default.png') {
            setImgSrc('/images/badges/default.png');
        }
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
        />
    );
};

export default BadgeImage;
