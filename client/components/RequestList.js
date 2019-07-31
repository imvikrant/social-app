"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_list_1 = __importStar(require("@material/react-list"));
const react_button_1 = __importDefault(require("@material/react-button"));
const react_typography_1 = require("@material/react-typography");
const react_apollo_1 = require("react-apollo");
const acceptRequest_1 = __importDefault(require("./../mutations/acceptRequest"));
const fetchFriendsList_1 = __importDefault(require("../queries/fetchFriendsList"));
const fetchRequests_1 = __importDefault(require("./../queries/fetchRequests"));
class RequestList extends react_1.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.subscribeToRequests();
    }
    render() {
        return (react_1.default.createElement(react_apollo_1.Mutation, { mutation: acceptRequest_1.default, update: (cache, { data: { acceptRequest } }) => {
                console.log('start...');
                const { user } = cache.readQuery({ query: fetchFriendsList_1.default });
                const { user: user2 } = cache.readQuery({ query: fetchRequests_1.default });
                console.log('user', user);
                console.log('user2', user2);
                cache.writeQuery({
                    query: fetchFriendsList_1.default,
                    data: {
                        user: Object.assign({}, user, { friendsList: [...user.friendsList, acceptRequest] })
                    }
                });
                console.log('1done');
                cache.writeQuery({
                    query: fetchRequests_1.default,
                    data: {
                        user: Object.assign({}, user2, { requests: user2.requests.filter(({ id }) => id !== acceptRequest.id) })
                    }
                });
                console.log('2done');
            } }, (acceptRequest, data) => (react_1.default.createElement(react_list_1.default, null, this.props.data.user.requests.map(u => (react_1.default.createElement(react_list_1.ListItem, { key: Math.random(), className: "friendList" },
            react_1.default.createElement(react_list_1.ListItemGraphic, { className: "profilePic", graphic: react_1.default.createElement("img", { src: `/profileImage/${u.id}` }) }),
            react_1.default.createElement(react_list_1.ListItemText, { primaryText: `${u.firstName} ${u.lastName}` }),
            react_1.default.createElement(react_list_1.ListItemMeta, { meta: react_1.default.createElement(react_button_1.default, { onClick: () => acceptRequest({ variables: { id: u.id } }) },
                    react_1.default.createElement(react_typography_1.Caption, null, "Accept Request")) }))))))));
    }
}
exports.default = RequestList;
