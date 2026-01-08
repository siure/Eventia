export const toJSONPlugin = function(schema) {
    schema.virtual('id').get(function() {
        return this._id ? this._id.toString() : undefined;
    });

    schema.set('toJSON', {
        virtuals: true,
        transform: (doc, ret) => {
            if (ret._id) {
                ret.id = ret._id.toString();
                delete ret._id;
            }
            if (ret.__v !== undefined) {
                delete ret.__v;
            }
            return ret;
        },
    });
};