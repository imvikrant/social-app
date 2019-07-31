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
const react_apollo_1 = require("react-apollo");
const react_list_1 = __importStar(require("@material/react-list"));
const react_typography_1 = require("@material/react-typography");
const react_button_1 = __importDefault(require("@material/react-button"));
const react_layout_grid_1 = require("@material/react-layout-grid");
const react_tab_1 = __importDefault(require("@material/react-tab"));
const react_tab_bar_1 = __importDefault(require("@material/react-tab-bar"));
const fetchFriendsList_1 = __importDefault(require("./../queries/fetchFriendsList"));
require("./Friends.scss");
const Search_1 = __importDefault(require("./Search"));
const Requests_1 = __importDefault(require("./Requests"));
const Friends = () => {
    const [activeTabIndex, setActiveTabIndex] = react_1.useState(0);
    return (react_1.default.createElement(react_layout_grid_1.Grid, { className: "friends-grid" },
        react_1.default.createElement(react_layout_grid_1.Row, null,
            react_1.default.createElement(react_layout_grid_1.Cell, { columns: 8, className: "friends-grid-cell" },
                react_1.default.createElement(react_tab_bar_1.default, { className: "tab-bar", activeIndex: activeTabIndex, handleActiveIndexUpdate: index => setActiveTabIndex(index) },
                    react_1.default.createElement(react_tab_1.default, { className: "tab" },
                        react_1.default.createElement("span", { className: "mdc-tab__text-label" }, "Friends")),
                    react_1.default.createElement(react_tab_1.default, { className: "tab" },
                        react_1.default.createElement("span", { className: "mdc-tab__text-label" }, "Requests")),
                    react_1.default.createElement(react_tab_1.default, { className: "tab" },
                        react_1.default.createElement("span", { className: "mdc-tab__text-label" }, "Search"))),
                react_1.default.createElement(react_apollo_1.Query, { query: fetchFriendsList_1.default }, ({ loading, error, data }) => {
                    if (loading)
                        return react_1.default.createElement("h1", null, "Loading...");
                    if (error)
                        return react_1.default.createElement("h1", null, "Error");
                    console.log(data);
                    if (activeTabIndex === 0)
                        return (react_1.default.createElement(react_list_1.default, null, data.user.friendsList.map(friend => (react_1.default.createElement(react_list_1.ListItem, { className: "friendList", key: friend.id },
                            react_1.default.createElement(react_list_1.ListItemGraphic, { className: "profilePic", graphic: react_1.default.createElement("img", { src: `/profileImage/${friend.id}` }) }),
                            react_1.default.createElement(react_list_1.ListItemText, { primaryText: friend.username }),
                            react_1.default.createElement(react_list_1.ListItemMeta, { meta: react_1.default.createElement(react_button_1.default, null,
                                    react_1.default.createElement(react_typography_1.Caption, null, "Send Message")) }))))));
                    else if (activeTabIndex === 1) {
                        return react_1.default.createElement(Requests_1.default, null);
                    }
                    else {
                        return react_1.default.createElement(Search_1.default, null);
                    }
                })))));
};
exports.default = Friends;
