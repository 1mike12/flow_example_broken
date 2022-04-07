import {types} from "mobx-state-tree";
import {withEnvironment} from "../extensions/with-environment";
import {UserModel} from "../UserModel";

export const UserStoreModel = types.model("UserStore").props({
   map: types.optional(types.map(UserModel), {}),
})
.extend(withEnvironment)
.actions(self => ({}))
