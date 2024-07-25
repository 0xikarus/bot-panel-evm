import { useState, useEffect } from 'react';

const useElementPosition = (ref) => {
    const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

    useEffect(() => {
        const updatePosition = () => {
            if (ref.current) {
                const { x, y, width, height } = ref.current.getBoundingClientRect();
                setPosition({ x, y, width, height });
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        return () => {
            window.removeEventListener('resize', updatePosition);
        };
    }, [ref]);

    return position;
};

export default useElementPosition;