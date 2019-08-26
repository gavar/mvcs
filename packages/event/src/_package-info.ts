import { DefaultEventEmitter } from "./default-event-emitter";
import { EventEmitter } from "./event-emitter";
import { EventDef } from "./event-name";

// How you CAN define strongly typed event
const EMPTY_EVENT: EventDef = "void-event";
const STRING_EVENT: EventDef<[string]> = "string-event";
const NUMBER_EVENT: EventDef<[number]> = "number-event";
const NUMBER_EVENT_KEY: EventDef<[number]> = {type: "key-number-event"};
const OPTIONAL_EVENT: EventDef<[string?]> = "optional-event";
const MANY_ARGS_EVENT: EventDef<[string, number]> = "many-args-event";

// Emitter
const emitter: EventEmitter = new DefaultEventEmitter();

// emit non-strict event support
emitter.emit("some-event"); // emit event without data
emitter.emit("some-event", {data: "any"}); // emit event with data of any type
emitter.emit("some-event", "any-string"); // emit event with data of any type

emitter.emit(EMPTY_EVENT);
// @ts-ignore | '""' is not assignable to 'void'
emitter.emit(EMPTY_EVENT, "");

emitter.emit(NUMBER_EVENT, 1);
emitter.emit(NUMBER_EVENT_KEY, 1);
// @ts-ignore | '""' is not assignable to 'number'
emitter.emit(NUMBER_EVENT, "");
// @ts-ignore | '""' is not assignable to 'number'
emitter.emit(NUMBER_EVENT_KEY, "");

emitter.emit(STRING_EVENT, "");
// @ts-ignore | expected 2 arguments but got 1
emitter.emit(STRING_EVENT);
// @ts-ignore | '1' is not assignable to 'string'
emitter.emit(STRING_EVENT, 1);

emitter.emit(OPTIONAL_EVENT, "");
emitter.emit(OPTIONAL_EVENT);

emitter.emit(MANY_ARGS_EVENT, "", 1);
// @ts-ignore | expected 3 arguments but got 2
emitter.emit(MANY_ARGS_EVENT, "");
