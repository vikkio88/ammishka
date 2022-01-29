const { USER_TYPES } = require('ammishka-shared/types');
const User = require('../../libs/User');

const USER_ID = 'someUserId';

const getMockedUser = ({ id = USER_ID } = {}) => {
    return new User(id);
};

describe('User specs', () => {
    it('builds a User', () => {
        const user = getMockedUser();
        const serialised = user.toJson();
        expect(serialised).toEqual({
            id: USER_ID,
            name: expect.any(String),
            type: expect.stringMatching(new RegExp(Object.values(USER_TYPES).join('|'))),
        });

    });
});