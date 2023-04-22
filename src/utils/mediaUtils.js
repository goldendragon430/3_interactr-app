export const MEDIA_RATIOS = {
    720 : '16:9',
    540 : '4:3',
    228 : '9:16'
};

export const getMediaRatio = (width, height) => {       
	const ratio = width / height;
	if(ratio >= 1.7 && ratio <= 1.8) return "16:9";
	if(ratio >= 1.3 && ratio <= 1.4) return "4:3";
	if(ratio >= 0.5 && ratio <= 0.6) return "9:16";	
	return "other";
}