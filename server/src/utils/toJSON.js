// Shared toJSON options: _id -> id, drop __v and password
export const toJSONOptions = {
  versionKey: false,
  transform(_doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.password;
    return ret;
  },
};
