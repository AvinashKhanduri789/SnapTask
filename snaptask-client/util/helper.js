 export const formatDate = (isoDate) => {
    if (!isoDate) return 'No deadline';
    
    const date = new Date(isoDate);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If within 7 days, show relative time
    if (diffDays <= 7 && diffDays >= 0) {
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Tomorrow';
      return `In ${diffDays} days`;
    }

    // Otherwise show formatted date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };