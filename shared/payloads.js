
const actionPayload = (
    /** @type String */
    type,
    payload = {}
) => (
    {
        /** @type String */
        type,
        payload
    }
);
const actionResult = (
    /** @type Boolean */
    success,
    payload = {}
) => ({
    /** @type Boolean */
    success,
    payload: { ...payload }
});


module.exports = {
    actionPayload,
    actionResult
};