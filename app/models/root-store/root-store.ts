import {Instance, SnapshotOut, types} from "mobx-state-tree"
import {withEnvironment} from "../extensions/with-environment";
import {UserStoreModel} from "../stores/UserStore";
import {UserModel} from "../UserModel";

// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
   userStore: types.optional(UserStoreModel, {}),
   activeUser: types.maybe(UserModel),
})
.extend(withEnvironment)
.actions(self => ({
   loadActiveUser: function () {
      let data = {
         id: "1",
         name: "Smiley McGee",
      }
      self.activeUser = UserModel.create(data)
      self.activeUser.loadCertifications()
   }
}))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {
}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {
}
