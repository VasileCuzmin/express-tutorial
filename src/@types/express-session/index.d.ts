import 'express-session';
import {type User} from '../types.ts'

declare module 'express-session' {
    interface SessionData {
        visited?: boolean;
        user?: User;
    }
}

//what happens in this file?
// This file is a TypeScript declaration file that extends the types provided by the `express-session` module.
// It declares a module augmentation for `express-session`, specifically adding a new property to the `SessionData` interface.
// So is this a merge?
// Yes, this is a merge. In TypeScript, when you declare a module with the same name as an existing module,
//  it merges the new declarations with the existing ones.