const validTransitions = {
    Pending: ['Paid', 'Cancelled'],
    Paid: ['Shipped'],
    Shipped: ['Delivered'],
    Delivered: [],
    Cancelled: []
};

export const canTransition = (currentStatus, newStatus) => {
    if (!validTransitions[currentStatus]) return false;
    return validTransitions[currentStatus].includes(newStatus);
};
