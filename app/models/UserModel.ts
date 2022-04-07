import {flow, Instance, SnapshotOut, types} from "mobx-state-tree"


export const UserModel = types.model("User").props({
   id: types.maybe(types.identifier),
   name: types.maybe(types.string),
})
.actions(self => ({
   /**
    * The app should be in a working state with the current code. However, if we uncomment the flow-wrapped version of the code, and tap r on the
    * bundler, we should see the problem. There will be no error, but the button on the homescreen will stop working, along with the bundler
    * itself. ie further changes to js code will no longer trigger the bundler to rebuild.
    */
   // 1. comment below
   loadCertifications: function () {
      console.log("random function")
   },
   // 2. uncomment the flow version of the same function

   // loadCertifications: flow(function* () {
   //    console.log("random function")
   // }),
}))
type UserType = Instance<typeof UserModel>

export interface User extends UserType {
}

export type UserSnapshotType = SnapshotOut<typeof UserModel>

export interface UserSnapshot extends UserSnapshotType {
}
