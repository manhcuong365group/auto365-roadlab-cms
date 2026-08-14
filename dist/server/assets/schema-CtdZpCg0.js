//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/entity.js
var entityKind = Symbol.for("drizzle:entityKind");
function is(value, type) {
	if (!value || typeof value !== "object") return false;
	if (value instanceof type) return true;
	if (!Object.prototype.hasOwnProperty.call(type, entityKind)) throw new Error(`Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`);
	let cls = Object.getPrototypeOf(value).constructor;
	if (cls) while (cls) {
		if (entityKind in cls && cls[entityKind] === type[entityKind]) return true;
		cls = Object.getPrototypeOf(cls);
	}
	return false;
}
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/column.js
var Column = class {
	constructor(table, config) {
		this.table = table;
		this.config = config;
		this.name = config.name;
		this.keyAsName = config.keyAsName;
		this.notNull = config.notNull;
		this.default = config.default;
		this.defaultFn = config.defaultFn;
		this.onUpdateFn = config.onUpdateFn;
		this.hasDefault = config.hasDefault;
		this.primary = config.primaryKey;
		this.isUnique = config.isUnique;
		this.uniqueName = config.uniqueName;
		this.uniqueType = config.uniqueType;
		this.dataType = config.dataType;
		this.columnType = config.columnType;
		this.generated = config.generated;
		this.generatedIdentity = config.generatedIdentity;
	}
	static [entityKind] = "Column";
	name;
	keyAsName;
	primary;
	notNull;
	default;
	defaultFn;
	onUpdateFn;
	hasDefault;
	isUnique;
	uniqueName;
	uniqueType;
	dataType;
	columnType;
	enumValues = void 0;
	generated = void 0;
	generatedIdentity = void 0;
	config;
	mapFromDriverValue(value) {
		return value;
	}
	mapToDriverValue(value) {
		return value;
	}
	shouldDisableInsert() {
		return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
	}
};
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/column-builder.js
var ColumnBuilder = class {
	static [entityKind] = "ColumnBuilder";
	config;
	constructor(name, dataType, columnType) {
		this.config = {
			name,
			keyAsName: name === "",
			notNull: false,
			default: void 0,
			hasDefault: false,
			primaryKey: false,
			isUnique: false,
			uniqueName: void 0,
			uniqueType: void 0,
			dataType,
			columnType,
			generated: void 0
		};
	}
	/**
	* Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
	*
	* @example
	* ```ts
	* const users = pgTable('users', {
	* 	id: integer('id').$type<UserId>().primaryKey(),
	* 	details: json('details').$type<UserDetails>().notNull(),
	* });
	* ```
	*/
	$type() {
		return this;
	}
	/**
	* Adds a `not null` clause to the column definition.
	*
	* Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
	*/
	notNull() {
		this.config.notNull = true;
		return this;
	}
	/**
	* Adds a `default <value>` clause to the column definition.
	*
	* Affects the `insert` model of the table - columns *with* `default` are optional on insert.
	*
	* If you need to set a dynamic default value, use {@link $defaultFn} instead.
	*/
	default(value) {
		this.config.default = value;
		this.config.hasDefault = true;
		return this;
	}
	/**
	* Adds a dynamic default value to the column.
	* The function will be called when the row is inserted, and the returned value will be used as the column value.
	*
	* **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
	*/
	$defaultFn(fn) {
		this.config.defaultFn = fn;
		this.config.hasDefault = true;
		return this;
	}
	/**
	* Alias for {@link $defaultFn}.
	*/
	$default = this.$defaultFn;
	/**
	* Adds a dynamic update value to the column.
	* The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
	* If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
	*
	* **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
	*/
	$onUpdateFn(fn) {
		this.config.onUpdateFn = fn;
		this.config.hasDefault = true;
		return this;
	}
	/**
	* Alias for {@link $onUpdateFn}.
	*/
	$onUpdate = this.$onUpdateFn;
	/**
	* Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
	*
	* In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
	*/
	primaryKey() {
		this.config.primaryKey = true;
		this.config.notNull = true;
		return this;
	}
	/** @internal Sets the name of the column to the key within the table definition if a name was not given. */
	setName(name) {
		if (this.config.name !== "") return;
		this.config.name = name;
	}
};
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/table.utils.js
var TableName = Symbol.for("drizzle:Name");
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/pg-core/columns/enum.js
var isPgEnumSym = Symbol.for("drizzle:isPgEnum");
function isPgEnum(obj) {
	return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/subquery.js
var Subquery = class {
	static [entityKind] = "Subquery";
	constructor(sql, fields, alias, isWith = false, usedTables = []) {
		this._ = {
			brand: "Subquery",
			sql,
			selectedFields: fields,
			alias,
			isWith,
			usedTables
		};
	}
};
var WithSubquery = class extends Subquery {
	static [entityKind] = "WithSubquery";
};
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/tracing.js
var tracer = { startActiveSpan(name, fn) {
	return fn();
} };
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/view-common.js
var ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/table.js
var Schema = Symbol.for("drizzle:Schema");
var Columns = Symbol.for("drizzle:Columns");
var ExtraConfigColumns = Symbol.for("drizzle:ExtraConfigColumns");
var OriginalName = Symbol.for("drizzle:OriginalName");
var BaseName = Symbol.for("drizzle:BaseName");
var IsAlias = Symbol.for("drizzle:IsAlias");
var ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
var IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");
var Table = class {
	static [entityKind] = "Table";
	/** @internal */
	static Symbol = {
		Name: TableName,
		Schema,
		OriginalName,
		Columns,
		ExtraConfigColumns,
		BaseName,
		IsAlias,
		ExtraConfigBuilder
	};
	/**
	* @internal
	* Can be changed if the table is aliased.
	*/
	[TableName];
	/**
	* @internal
	* Used to store the original name of the table, before any aliasing.
	*/
	[OriginalName];
	/** @internal */
	[Schema];
	/** @internal */
	[Columns];
	/** @internal */
	[ExtraConfigColumns];
	/**
	*  @internal
	* Used to store the table name before the transformation via the `tableCreator` functions.
	*/
	[BaseName];
	/** @internal */
	[IsAlias] = false;
	/** @internal */
	[IsDrizzleTable] = true;
	/** @internal */
	[ExtraConfigBuilder] = void 0;
	constructor(name, schema, baseName) {
		this[TableName] = this[OriginalName] = name;
		this[Schema] = schema;
		this[BaseName] = baseName;
	}
};
function getTableName(table) {
	return table[TableName];
}
function getTableUniqueName(table) {
	return `${table[Schema] ?? "public"}.${table[TableName]}`;
}
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/sql/sql.js
function isSQLWrapper(value) {
	return value !== null && value !== void 0 && typeof value.getSQL === "function";
}
function mergeQueries(queries) {
	const result = {
		sql: "",
		params: []
	};
	for (const query of queries) {
		result.sql += query.sql;
		result.params.push(...query.params);
		if (query.typings?.length) {
			if (!result.typings) result.typings = [];
			result.typings.push(...query.typings);
		}
	}
	return result;
}
var StringChunk = class {
	static [entityKind] = "StringChunk";
	value;
	constructor(value) {
		this.value = Array.isArray(value) ? value : [value];
	}
	getSQL() {
		return new SQL([this]);
	}
};
var SQL = class SQL {
	constructor(queryChunks) {
		this.queryChunks = queryChunks;
		for (const chunk of queryChunks) if (is(chunk, Table)) {
			const schemaName = chunk[Table.Symbol.Schema];
			this.usedTables.push(schemaName === void 0 ? chunk[Table.Symbol.Name] : schemaName + "." + chunk[Table.Symbol.Name]);
		}
	}
	static [entityKind] = "SQL";
	/** @internal */
	decoder = noopDecoder;
	shouldInlineParams = false;
	/** @internal */
	usedTables = [];
	append(query) {
		this.queryChunks.push(...query.queryChunks);
		return this;
	}
	toQuery(config) {
		return tracer.startActiveSpan("drizzle.buildSQL", (span) => {
			const query = this.buildQueryFromSourceParams(this.queryChunks, config);
			span?.setAttributes({
				"drizzle.query.text": query.sql,
				"drizzle.query.params": JSON.stringify(query.params)
			});
			return query;
		});
	}
	buildQueryFromSourceParams(chunks, _config) {
		const config = Object.assign({}, _config, {
			inlineParams: _config.inlineParams || this.shouldInlineParams,
			paramStartIndex: _config.paramStartIndex || { value: 0 }
		});
		const { casing, escapeName, escapeParam, prepareTyping, inlineParams, paramStartIndex } = config;
		return mergeQueries(chunks.map((chunk) => {
			if (is(chunk, StringChunk)) return {
				sql: chunk.value.join(""),
				params: []
			};
			if (is(chunk, Name)) return {
				sql: escapeName(chunk.value),
				params: []
			};
			if (chunk === void 0) return {
				sql: "",
				params: []
			};
			if (Array.isArray(chunk)) {
				const result = [new StringChunk("(")];
				for (const [i, p] of chunk.entries()) {
					result.push(p);
					if (i < chunk.length - 1) result.push(new StringChunk(", "));
				}
				result.push(new StringChunk(")"));
				return this.buildQueryFromSourceParams(result, config);
			}
			if (is(chunk, SQL)) return this.buildQueryFromSourceParams(chunk.queryChunks, {
				...config,
				inlineParams: inlineParams || chunk.shouldInlineParams
			});
			if (is(chunk, Table)) {
				const schemaName = chunk[Table.Symbol.Schema];
				const tableName = chunk[Table.Symbol.Name];
				return {
					sql: schemaName === void 0 || chunk[IsAlias] ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
					params: []
				};
			}
			if (is(chunk, Column)) {
				const columnName = casing.getColumnCasing(chunk);
				if (_config.invokeSource === "indexes") return {
					sql: escapeName(columnName),
					params: []
				};
				const schemaName = chunk.table[Table.Symbol.Schema];
				return {
					sql: chunk.table[IsAlias] || schemaName === void 0 ? escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName),
					params: []
				};
			}
			if (is(chunk, View)) {
				const schemaName = chunk[ViewBaseConfig].schema;
				const viewName = chunk[ViewBaseConfig].name;
				return {
					sql: schemaName === void 0 || chunk[ViewBaseConfig].isAlias ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
					params: []
				};
			}
			if (is(chunk, Param)) {
				if (is(chunk.value, Placeholder)) return {
					sql: escapeParam(paramStartIndex.value++, chunk),
					params: [chunk],
					typings: ["none"]
				};
				const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
				if (is(mappedValue, SQL)) return this.buildQueryFromSourceParams([mappedValue], config);
				if (inlineParams) return {
					sql: this.mapInlineParam(mappedValue, config),
					params: []
				};
				let typings = ["none"];
				if (prepareTyping) typings = [prepareTyping(chunk.encoder)];
				return {
					sql: escapeParam(paramStartIndex.value++, mappedValue),
					params: [mappedValue],
					typings
				};
			}
			if (is(chunk, Placeholder)) return {
				sql: escapeParam(paramStartIndex.value++, chunk),
				params: [chunk],
				typings: ["none"]
			};
			if (is(chunk, SQL.Aliased) && chunk.fieldAlias !== void 0) return {
				sql: escapeName(chunk.fieldAlias),
				params: []
			};
			if (is(chunk, Subquery)) {
				if (chunk._.isWith) return {
					sql: escapeName(chunk._.alias),
					params: []
				};
				return this.buildQueryFromSourceParams([
					new StringChunk("("),
					chunk._.sql,
					new StringChunk(") "),
					new Name(chunk._.alias)
				], config);
			}
			if (isPgEnum(chunk)) {
				if (chunk.schema) return {
					sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName),
					params: []
				};
				return {
					sql: escapeName(chunk.enumName),
					params: []
				};
			}
			if (isSQLWrapper(chunk)) {
				if (chunk.shouldOmitSQLParens?.()) return this.buildQueryFromSourceParams([chunk.getSQL()], config);
				return this.buildQueryFromSourceParams([
					new StringChunk("("),
					chunk.getSQL(),
					new StringChunk(")")
				], config);
			}
			if (inlineParams) return {
				sql: this.mapInlineParam(chunk, config),
				params: []
			};
			return {
				sql: escapeParam(paramStartIndex.value++, chunk),
				params: [chunk],
				typings: ["none"]
			};
		}));
	}
	mapInlineParam(chunk, { escapeString }) {
		if (chunk === null) return "null";
		if (typeof chunk === "number" || typeof chunk === "boolean") return chunk.toString();
		if (typeof chunk === "string") return escapeString(chunk);
		if (typeof chunk === "object") {
			const mappedValueAsString = chunk.toString();
			if (mappedValueAsString === "[object Object]") return escapeString(JSON.stringify(chunk));
			return escapeString(mappedValueAsString);
		}
		throw new Error("Unexpected param value: " + chunk);
	}
	getSQL() {
		return this;
	}
	as(alias) {
		if (alias === void 0) return this;
		return new SQL.Aliased(this, alias);
	}
	mapWith(decoder) {
		this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
		return this;
	}
	inlineParams() {
		this.shouldInlineParams = true;
		return this;
	}
	/**
	* This method is used to conditionally include a part of the query.
	*
	* @param condition - Condition to check
	* @returns itself if the condition is `true`, otherwise `undefined`
	*/
	if(condition) {
		return condition ? this : void 0;
	}
};
var Name = class {
	constructor(value) {
		this.value = value;
	}
	static [entityKind] = "Name";
	brand;
	getSQL() {
		return new SQL([this]);
	}
};
function isDriverValueEncoder(value) {
	return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
var noopDecoder = { mapFromDriverValue: (value) => value };
var noopEncoder = { mapToDriverValue: (value) => value };
({
	...noopDecoder,
	...noopEncoder
});
var Param = class {
	/**
	* @param value - Parameter value
	* @param encoder - Encoder to convert the value to a driver parameter
	*/
	constructor(value, encoder = noopEncoder) {
		this.value = value;
		this.encoder = encoder;
	}
	static [entityKind] = "Param";
	brand;
	getSQL() {
		return new SQL([this]);
	}
};
function sql(strings, ...params) {
	const queryChunks = [];
	if (params.length > 0 || strings.length > 0 && strings[0] !== "") queryChunks.push(new StringChunk(strings[0]));
	for (const [paramIndex, param2] of params.entries()) queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
	return new SQL(queryChunks);
}
((sql2) => {
	function empty() {
		return new SQL([]);
	}
	sql2.empty = empty;
	function fromList(list) {
		return new SQL(list);
	}
	sql2.fromList = fromList;
	function raw(str) {
		return new SQL([new StringChunk(str)]);
	}
	sql2.raw = raw;
	function join(chunks, separator) {
		const result = [];
		for (const [i, chunk] of chunks.entries()) {
			if (i > 0 && separator !== void 0) result.push(separator);
			result.push(chunk);
		}
		return new SQL(result);
	}
	sql2.join = join;
	function identifier(value) {
		return new Name(value);
	}
	sql2.identifier = identifier;
	function placeholder2(name2) {
		return new Placeholder(name2);
	}
	sql2.placeholder = placeholder2;
	function param2(value, encoder) {
		return new Param(value, encoder);
	}
	sql2.param = param2;
})(sql || (sql = {}));
((SQL2) => {
	class Aliased {
		constructor(sql2, fieldAlias) {
			this.sql = sql2;
			this.fieldAlias = fieldAlias;
		}
		static [entityKind] = "SQL.Aliased";
		/** @internal */
		isSelectionField = false;
		getSQL() {
			return this.sql;
		}
		/** @internal */
		clone() {
			return new Aliased(this.sql, this.fieldAlias);
		}
	}
	SQL2.Aliased = Aliased;
})(SQL || (SQL = {}));
var Placeholder = class {
	constructor(name2) {
		this.name = name2;
	}
	static [entityKind] = "Placeholder";
	getSQL() {
		return new SQL([this]);
	}
};
function fillPlaceholders(params, values) {
	return params.map((p) => {
		if (is(p, Placeholder)) {
			if (!(p.name in values)) throw new Error(`No value for placeholder "${p.name}" was provided`);
			return values[p.name];
		}
		if (is(p, Param) && is(p.value, Placeholder)) {
			if (!(p.value.name in values)) throw new Error(`No value for placeholder "${p.value.name}" was provided`);
			return p.encoder.mapToDriverValue(values[p.value.name]);
		}
		return p;
	});
}
var IsDrizzleView = Symbol.for("drizzle:IsDrizzleView");
var View = class {
	static [entityKind] = "View";
	/** @internal */
	[ViewBaseConfig];
	/** @internal */
	[IsDrizzleView] = true;
	constructor({ name: name2, schema, selectedFields, query }) {
		this[ViewBaseConfig] = {
			name: name2,
			originalName: name2,
			schema,
			selectedFields,
			query,
			isExisting: !query,
			isAlias: false
		};
	}
	getSQL() {
		return new SQL([this]);
	}
};
Column.prototype.getSQL = function() {
	return new SQL([this]);
};
Table.prototype.getSQL = function() {
	return new SQL([this]);
};
Subquery.prototype.getSQL = function() {
	return new SQL([this]);
};
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/utils.js
function mapResultRow(columns, row, joinsNotNullableMap) {
	const nullifyMap = {};
	const result = columns.reduce((result2, { path, field }, columnIndex) => {
		let decoder;
		if (is(field, Column)) decoder = field;
		else if (is(field, SQL)) decoder = field.decoder;
		else if (is(field, Subquery)) decoder = field._.sql.decoder;
		else decoder = field.sql.decoder;
		let node = result2;
		for (const [pathChunkIndex, pathChunk] of path.entries()) if (pathChunkIndex < path.length - 1) {
			if (!(pathChunk in node)) node[pathChunk] = {};
			node = node[pathChunk];
		} else {
			const rawValue = row[columnIndex];
			const value = node[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
			if (joinsNotNullableMap && is(field, Column) && path.length === 2) {
				const objectName = path[0];
				if (!(objectName in nullifyMap)) nullifyMap[objectName] = value === null ? getTableName(field.table) : false;
				else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== getTableName(field.table)) nullifyMap[objectName] = false;
			}
		}
		return result2;
	}, {});
	if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
		for (const [objectName, tableName] of Object.entries(nullifyMap)) if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) result[objectName] = null;
	}
	return result;
}
function orderSelectedFields(fields, pathPrefix) {
	return Object.entries(fields).reduce((result, [name, field]) => {
		if (typeof name !== "string") return result;
		const newPath = pathPrefix ? [...pathPrefix, name] : [name];
		if (is(field, Column) || is(field, SQL) || is(field, SQL.Aliased) || is(field, Subquery)) result.push({
			path: newPath,
			field
		});
		else if (is(field, Table)) result.push(...orderSelectedFields(field[Table.Symbol.Columns], newPath));
		else result.push(...orderSelectedFields(field, newPath));
		return result;
	}, []);
}
function haveSameKeys(left, right) {
	const leftKeys = Object.keys(left);
	const rightKeys = Object.keys(right);
	if (leftKeys.length !== rightKeys.length) return false;
	for (const [index, key] of leftKeys.entries()) if (key !== rightKeys[index]) return false;
	return true;
}
function mapUpdateSet(table, values) {
	const entries = Object.entries(values).filter(([, value]) => value !== void 0).map(([key, value]) => {
		if (is(value, SQL) || is(value, Column)) return [key, value];
		else return [key, new Param(value, table[Table.Symbol.Columns][key])];
	});
	if (entries.length === 0) throw new Error("No values to set");
	return Object.fromEntries(entries);
}
function applyMixins(baseClass, extendedClasses) {
	for (const extendedClass of extendedClasses) for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
		if (name === "constructor") continue;
		Object.defineProperty(baseClass.prototype, name, Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || /* @__PURE__ */ Object.create(null));
	}
}
function getTableColumns(table) {
	return table[Table.Symbol.Columns];
}
function getTableLikeName(table) {
	return is(table, Subquery) ? table._.alias : is(table, View) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : table[Table.Symbol.IsAlias] ? table[Table.Symbol.Name] : table[Table.Symbol.BaseName];
}
function getColumnNameAndConfig(a, b) {
	return {
		name: typeof a === "string" && a.length > 0 ? a : "",
		config: typeof a === "object" ? a : b
	};
}
var textDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder();
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/sqlite-core/foreign-keys.js
var ForeignKeyBuilder = class {
	static [entityKind] = "SQLiteForeignKeyBuilder";
	/** @internal */
	reference;
	/** @internal */
	_onUpdate;
	/** @internal */
	_onDelete;
	constructor(config, actions) {
		this.reference = () => {
			const { name, columns, foreignColumns } = config();
			return {
				name,
				columns,
				foreignTable: foreignColumns[0].table,
				foreignColumns
			};
		};
		if (actions) {
			this._onUpdate = actions.onUpdate;
			this._onDelete = actions.onDelete;
		}
	}
	onUpdate(action) {
		this._onUpdate = action;
		return this;
	}
	onDelete(action) {
		this._onDelete = action;
		return this;
	}
	/** @internal */
	build(table) {
		return new ForeignKey(table, this);
	}
};
var ForeignKey = class {
	constructor(table, builder) {
		this.table = table;
		this.reference = builder.reference;
		this.onUpdate = builder._onUpdate;
		this.onDelete = builder._onDelete;
	}
	static [entityKind] = "SQLiteForeignKey";
	reference;
	onUpdate;
	onDelete;
	getName() {
		const { name, columns, foreignColumns } = this.reference();
		const columnNames = columns.map((column) => column.name);
		const foreignColumnNames = foreignColumns.map((column) => column.name);
		const chunks = [
			this.table[TableName],
			...columnNames,
			foreignColumns[0].table[TableName],
			...foreignColumnNames
		];
		return name ?? `${chunks.join("_")}_fk`;
	}
};
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/sqlite-core/unique-constraint.js
function uniqueKeyName(table, columns) {
	return `${table[TableName]}_${columns.join("_")}_unique`;
}
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/sqlite-core/columns/common.js
var SQLiteColumnBuilder = class extends ColumnBuilder {
	static [entityKind] = "SQLiteColumnBuilder";
	foreignKeyConfigs = [];
	references(ref, actions = {}) {
		this.foreignKeyConfigs.push({
			ref,
			actions
		});
		return this;
	}
	unique(name) {
		this.config.isUnique = true;
		this.config.uniqueName = name;
		return this;
	}
	generatedAlwaysAs(as, config) {
		this.config.generated = {
			as,
			type: "always",
			mode: config?.mode ?? "virtual"
		};
		return this;
	}
	/** @internal */
	buildForeignKeys(column, table) {
		return this.foreignKeyConfigs.map(({ ref, actions }) => {
			return ((ref2, actions2) => {
				const builder = new ForeignKeyBuilder(() => {
					const foreignColumn = ref2();
					return {
						columns: [column],
						foreignColumns: [foreignColumn]
					};
				});
				if (actions2.onUpdate) builder.onUpdate(actions2.onUpdate);
				if (actions2.onDelete) builder.onDelete(actions2.onDelete);
				return builder.build(table);
			})(ref, actions);
		});
	}
};
var SQLiteColumn = class extends Column {
	constructor(table, config) {
		if (!config.uniqueName) config.uniqueName = uniqueKeyName(table, [config.name]);
		super(table, config);
		this.table = table;
	}
	static [entityKind] = "SQLiteColumn";
};
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/sqlite-core/columns/blob.js
var SQLiteBigIntBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteBigIntBuilder";
	constructor(name) {
		super(name, "bigint", "SQLiteBigInt");
	}
	/** @internal */
	build(table) {
		return new SQLiteBigInt(table, this.config);
	}
};
var SQLiteBigInt = class extends SQLiteColumn {
	static [entityKind] = "SQLiteBigInt";
	getSQLType() {
		return "blob";
	}
	mapFromDriverValue(value) {
		if (typeof Buffer !== "undefined" && Buffer.from) {
			const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
			return BigInt(buf.toString("utf8"));
		}
		return BigInt(textDecoder.decode(value));
	}
	mapToDriverValue(value) {
		return Buffer.from(value.toString());
	}
};
var SQLiteBlobJsonBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteBlobJsonBuilder";
	constructor(name) {
		super(name, "json", "SQLiteBlobJson");
	}
	/** @internal */
	build(table) {
		return new SQLiteBlobJson(table, this.config);
	}
};
var SQLiteBlobJson = class extends SQLiteColumn {
	static [entityKind] = "SQLiteBlobJson";
	getSQLType() {
		return "blob";
	}
	mapFromDriverValue(value) {
		if (typeof Buffer !== "undefined" && Buffer.from) {
			const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
			return JSON.parse(buf.toString("utf8"));
		}
		return JSON.parse(textDecoder.decode(value));
	}
	mapToDriverValue(value) {
		return Buffer.from(JSON.stringify(value));
	}
};
var SQLiteBlobBufferBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteBlobBufferBuilder";
	constructor(name) {
		super(name, "buffer", "SQLiteBlobBuffer");
	}
	/** @internal */
	build(table) {
		return new SQLiteBlobBuffer(table, this.config);
	}
};
var SQLiteBlobBuffer = class extends SQLiteColumn {
	static [entityKind] = "SQLiteBlobBuffer";
	mapFromDriverValue(value) {
		if (Buffer.isBuffer(value)) return value;
		return Buffer.from(value);
	}
	getSQLType() {
		return "blob";
	}
};
function blob(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	if (config?.mode === "json") return new SQLiteBlobJsonBuilder(name);
	if (config?.mode === "bigint") return new SQLiteBigIntBuilder(name);
	return new SQLiteBlobBufferBuilder(name);
}
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/sqlite-core/columns/custom.js
var SQLiteCustomColumnBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteCustomColumnBuilder";
	constructor(name, fieldConfig, customTypeParams) {
		super(name, "custom", "SQLiteCustomColumn");
		this.config.fieldConfig = fieldConfig;
		this.config.customTypeParams = customTypeParams;
	}
	/** @internal */
	build(table) {
		return new SQLiteCustomColumn(table, this.config);
	}
};
var SQLiteCustomColumn = class extends SQLiteColumn {
	static [entityKind] = "SQLiteCustomColumn";
	sqlName;
	mapTo;
	mapFrom;
	constructor(table, config) {
		super(table, config);
		this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
		this.mapTo = config.customTypeParams.toDriver;
		this.mapFrom = config.customTypeParams.fromDriver;
	}
	getSQLType() {
		return this.sqlName;
	}
	mapFromDriverValue(value) {
		return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
	}
	mapToDriverValue(value) {
		return typeof this.mapTo === "function" ? this.mapTo(value) : value;
	}
};
function customType(customTypeParams) {
	return (a, b) => {
		const { name, config } = getColumnNameAndConfig(a, b);
		return new SQLiteCustomColumnBuilder(name, config, customTypeParams);
	};
}
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/sqlite-core/columns/integer.js
var SQLiteBaseIntegerBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteBaseIntegerBuilder";
	constructor(name, dataType, columnType) {
		super(name, dataType, columnType);
		this.config.autoIncrement = false;
	}
	primaryKey(config) {
		if (config?.autoIncrement) this.config.autoIncrement = true;
		this.config.hasDefault = true;
		return super.primaryKey();
	}
};
var SQLiteBaseInteger = class extends SQLiteColumn {
	static [entityKind] = "SQLiteBaseInteger";
	autoIncrement = this.config.autoIncrement;
	getSQLType() {
		return "integer";
	}
};
var SQLiteIntegerBuilder = class extends SQLiteBaseIntegerBuilder {
	static [entityKind] = "SQLiteIntegerBuilder";
	constructor(name) {
		super(name, "number", "SQLiteInteger");
	}
	build(table) {
		return new SQLiteInteger(table, this.config);
	}
};
var SQLiteInteger = class extends SQLiteBaseInteger {
	static [entityKind] = "SQLiteInteger";
};
var SQLiteTimestampBuilder = class extends SQLiteBaseIntegerBuilder {
	static [entityKind] = "SQLiteTimestampBuilder";
	constructor(name, mode) {
		super(name, "date", "SQLiteTimestamp");
		this.config.mode = mode;
	}
	/**
	* @deprecated Use `default()` with your own expression instead.
	*
	* Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
	*/
	defaultNow() {
		return this.default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
	}
	build(table) {
		return new SQLiteTimestamp(table, this.config);
	}
};
var SQLiteTimestamp = class extends SQLiteBaseInteger {
	static [entityKind] = "SQLiteTimestamp";
	mode = this.config.mode;
	mapFromDriverValue(value) {
		if (this.config.mode === "timestamp") return /* @__PURE__ */ new Date(value * 1e3);
		return new Date(value);
	}
	mapToDriverValue(value) {
		const unix = value.getTime();
		if (this.config.mode === "timestamp") return Math.floor(unix / 1e3);
		return unix;
	}
};
var SQLiteBooleanBuilder = class extends SQLiteBaseIntegerBuilder {
	static [entityKind] = "SQLiteBooleanBuilder";
	constructor(name, mode) {
		super(name, "boolean", "SQLiteBoolean");
		this.config.mode = mode;
	}
	build(table) {
		return new SQLiteBoolean(table, this.config);
	}
};
var SQLiteBoolean = class extends SQLiteBaseInteger {
	static [entityKind] = "SQLiteBoolean";
	mode = this.config.mode;
	mapFromDriverValue(value) {
		return Number(value) === 1;
	}
	mapToDriverValue(value) {
		return value ? 1 : 0;
	}
};
function integer(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	if (config?.mode === "timestamp" || config?.mode === "timestamp_ms") return new SQLiteTimestampBuilder(name, config.mode);
	if (config?.mode === "boolean") return new SQLiteBooleanBuilder(name, config.mode);
	return new SQLiteIntegerBuilder(name);
}
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/sqlite-core/columns/numeric.js
var SQLiteNumericBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteNumericBuilder";
	constructor(name) {
		super(name, "string", "SQLiteNumeric");
	}
	/** @internal */
	build(table) {
		return new SQLiteNumeric(table, this.config);
	}
};
var SQLiteNumeric = class extends SQLiteColumn {
	static [entityKind] = "SQLiteNumeric";
	mapFromDriverValue(value) {
		if (typeof value === "string") return value;
		return String(value);
	}
	getSQLType() {
		return "numeric";
	}
};
var SQLiteNumericNumberBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteNumericNumberBuilder";
	constructor(name) {
		super(name, "number", "SQLiteNumericNumber");
	}
	/** @internal */
	build(table) {
		return new SQLiteNumericNumber(table, this.config);
	}
};
var SQLiteNumericNumber = class extends SQLiteColumn {
	static [entityKind] = "SQLiteNumericNumber";
	mapFromDriverValue(value) {
		if (typeof value === "number") return value;
		return Number(value);
	}
	mapToDriverValue = String;
	getSQLType() {
		return "numeric";
	}
};
var SQLiteNumericBigIntBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteNumericBigIntBuilder";
	constructor(name) {
		super(name, "bigint", "SQLiteNumericBigInt");
	}
	/** @internal */
	build(table) {
		return new SQLiteNumericBigInt(table, this.config);
	}
};
var SQLiteNumericBigInt = class extends SQLiteColumn {
	static [entityKind] = "SQLiteNumericBigInt";
	mapFromDriverValue = BigInt;
	mapToDriverValue = String;
	getSQLType() {
		return "numeric";
	}
};
function numeric(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	const mode = config?.mode;
	return mode === "number" ? new SQLiteNumericNumberBuilder(name) : mode === "bigint" ? new SQLiteNumericBigIntBuilder(name) : new SQLiteNumericBuilder(name);
}
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/sqlite-core/columns/real.js
var SQLiteRealBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteRealBuilder";
	constructor(name) {
		super(name, "number", "SQLiteReal");
	}
	/** @internal */
	build(table) {
		return new SQLiteReal(table, this.config);
	}
};
var SQLiteReal = class extends SQLiteColumn {
	static [entityKind] = "SQLiteReal";
	getSQLType() {
		return "real";
	}
};
function real(name) {
	return new SQLiteRealBuilder(name ?? "");
}
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/sqlite-core/columns/text.js
var SQLiteTextBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteTextBuilder";
	constructor(name, config) {
		super(name, "string", "SQLiteText");
		this.config.enumValues = config.enum;
		this.config.length = config.length;
	}
	/** @internal */
	build(table) {
		return new SQLiteText(table, this.config);
	}
};
var SQLiteText = class extends SQLiteColumn {
	static [entityKind] = "SQLiteText";
	enumValues = this.config.enumValues;
	length = this.config.length;
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return `text${this.config.length ? `(${this.config.length})` : ""}`;
	}
};
var SQLiteTextJsonBuilder = class extends SQLiteColumnBuilder {
	static [entityKind] = "SQLiteTextJsonBuilder";
	constructor(name) {
		super(name, "json", "SQLiteTextJson");
	}
	/** @internal */
	build(table) {
		return new SQLiteTextJson(table, this.config);
	}
};
var SQLiteTextJson = class extends SQLiteColumn {
	static [entityKind] = "SQLiteTextJson";
	getSQLType() {
		return "text";
	}
	mapFromDriverValue(value) {
		return JSON.parse(value);
	}
	mapToDriverValue(value) {
		return JSON.stringify(value);
	}
};
function text(a, b = {}) {
	const { name, config } = getColumnNameAndConfig(a, b);
	if (config.mode === "json") return new SQLiteTextJsonBuilder(name);
	return new SQLiteTextBuilder(name, config);
}
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/sqlite-core/columns/all.js
function getSQLiteColumnBuilders() {
	return {
		blob,
		customType,
		integer,
		numeric,
		real,
		text
	};
}
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/sqlite-core/table.js
var InlineForeignKeys = Symbol.for("drizzle:SQLiteInlineForeignKeys");
var SQLiteTable = class extends Table {
	static [entityKind] = "SQLiteTable";
	/** @internal */
	static Symbol = Object.assign({}, Table.Symbol, { InlineForeignKeys });
	/** @internal */
	[Table.Symbol.Columns];
	/** @internal */
	[InlineForeignKeys] = [];
	/** @internal */
	[Table.Symbol.ExtraConfigBuilder] = void 0;
};
function sqliteTableBase(name, columns, extraConfig, schema, baseName = name) {
	const rawTable = new SQLiteTable(name, schema, baseName);
	const parsedColumns = typeof columns === "function" ? columns(getSQLiteColumnBuilders()) : columns;
	const builtColumns = Object.fromEntries(Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
		const colBuilder = colBuilderBase;
		colBuilder.setName(name2);
		const column = colBuilder.build(rawTable);
		rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
		return [name2, column];
	}));
	const table = Object.assign(rawTable, builtColumns);
	table[Table.Symbol.Columns] = builtColumns;
	table[Table.Symbol.ExtraConfigColumns] = builtColumns;
	if (extraConfig) table[SQLiteTable.Symbol.ExtraConfigBuilder] = extraConfig;
	return table;
}
var sqliteTable = (name, columns, extraConfig) => {
	return sqliteTableBase(name, columns, extraConfig);
};
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/sqlite-core/indexes.js
var IndexBuilderOn = class {
	constructor(name, unique) {
		this.name = name;
		this.unique = unique;
	}
	static [entityKind] = "SQLiteIndexBuilderOn";
	on(...columns) {
		return new IndexBuilder(this.name, columns, this.unique);
	}
};
var IndexBuilder = class {
	static [entityKind] = "SQLiteIndexBuilder";
	/** @internal */
	config;
	constructor(name, columns, unique) {
		this.config = {
			name,
			columns,
			unique,
			where: void 0
		};
	}
	/**
	* Condition for partial index.
	*/
	where(condition) {
		this.config.where = condition;
		return this;
	}
	/** @internal */
	build(table) {
		return new Index(this.config, table);
	}
};
var Index = class {
	static [entityKind] = "SQLiteIndex";
	config;
	constructor(config, table) {
		this.config = {
			...config,
			table
		};
	}
};
function index(name) {
	return new IndexBuilderOn(name, false);
}
function uniqueIndex(name) {
	return new IndexBuilderOn(name, true);
}
//#endregion
//#region ../Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff/node_modules/drizzle-orm/sqlite-core/primary-keys.js
function primaryKey(...config) {
	if (config[0].columns) return new PrimaryKeyBuilder(config[0].columns, config[0].name);
	return new PrimaryKeyBuilder(config);
}
var PrimaryKeyBuilder = class {
	static [entityKind] = "SQLitePrimaryKeyBuilder";
	/** @internal */
	columns;
	/** @internal */
	name;
	constructor(columns, name) {
		this.columns = columns;
		this.name = name;
	}
	/** @internal */
	build(table) {
		return new PrimaryKey(table, this.columns, this.name);
	}
};
var PrimaryKey = class {
	constructor(table, columns, name) {
		this.table = table;
		this.columns = columns;
		this.name = name;
	}
	static [entityKind] = "SQLitePrimaryKey";
	columns;
	name;
	getName() {
		return this.name ?? `${this.table[SQLiteTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
	}
};
//#endregion
//#region db/schema.ts
var schema_exports = /* @__PURE__ */ __exportAll({
	auditEvents: () => auditEvents,
	authSessions: () => authSessions,
	caseAssignments: () => caseAssignments,
	caseFeedback: () => caseFeedback,
	caseRevisionMedia: () => caseRevisionMedia,
	caseRevisions: () => caseRevisions,
	cases: () => cases,
	dataIssues: () => dataIssues,
	gateEvaluations: () => gateEvaluations,
	mediaAssets: () => mediaAssets,
	notifications: () => notifications,
	outboxEvents: () => outboxEvents,
	publications: () => publications,
	rightsAttestations: () => rightsAttestations,
	technicalReviews: () => technicalReviews,
	urlRegistry: () => urlRegistry,
	userRoles: () => userRoles,
	users: () => users,
	workOrders: () => workOrders
});
var users = sqliteTable("users", {
	id: text("id").primaryKey(),
	email: text("email").notNull(),
	displayName: text("display_name").notNull(),
	passwordHash: text("password_hash"),
	profileRevision: integer("profile_revision").notNull().default(1),
	preferencesJson: text("preferences_json").notNull().default("{}"),
	status: text("status", { enum: ["active", "suspended"] }).notNull().default("active"),
	createdAt: text("created_at").notNull(),
	updatedAt: text("updated_at").notNull()
}, (table) => [uniqueIndex("users_email_uq").on(table.email)]);
var userRoles = sqliteTable("user_roles", {
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
	role: text("role", { enum: [
		"content",
		"oa",
		"seo_lead",
		"it",
		"boss",
		"technical_reviewer",
		"publisher",
		"seo_admin",
		"admin"
	] }).notNull(),
	branchRef: text("branch_ref").notNull().default("*"),
	grantedAt: text("granted_at").notNull(),
	grantedBy: text("granted_by").notNull()
}, (table) => [primaryKey({ columns: [
	table.userId,
	table.role,
	table.branchRef
] }), index("user_roles_role_idx").on(table.role)]);
var workOrders = sqliteTable("work_orders", {
	id: text("id").primaryKey(),
	externalId: text("external_id").notNull(),
	sourceSystem: text("source_system").notNull(),
	sourceVersion: integer("source_version").notNull(),
	sourceHash: text("source_hash").notNull(),
	vertical: text("vertical", { enum: ["lighting"] }).notNull(),
	branchRef: text("branch_ref").notNull(),
	readiness: text("readiness", { enum: [
		"ready",
		"missing_media",
		"blocked",
		"imported"
	] }).notNull(),
	payloadJson: text("payload_json").notNull(),
	syncedAt: text("synced_at").notNull()
}, (table) => [
	uniqueIndex("work_orders_source_id_uq").on(table.sourceSystem, table.externalId),
	uniqueIndex("work_orders_source_version_uq").on(table.sourceSystem, table.externalId, table.sourceVersion),
	index("work_orders_readiness_idx").on(table.readiness, table.syncedAt)
]);
var cases = sqliteTable("cases", {
	id: text("id").primaryKey(),
	caseCode: text("case_code").notNull(),
	workOrderId: text("work_order_id").notNull().references(() => workOrders.id),
	vertical: text("vertical", { enum: ["lighting"] }).notNull(),
	branchRef: text("branch_ref").notNull(),
	vehicleRef: text("vehicle_ref").notNull(),
	productRef: text("product_ref").notNull(),
	currentRevision: integer("current_revision").notNull().default(0),
	publishedRevision: integer("published_revision"),
	workflowStatus: text("workflow_status", { enum: [
		"draft",
		"ready_for_review",
		"in_review",
		"changes_requested",
		"technical_approved",
		"publishable",
		"published",
		"archived"
	] }).notNull().default("draft"),
	lockOwnerId: text("lock_owner_id").references(() => users.id),
	lockExpiresAt: text("lock_expires_at"),
	createdAt: text("created_at").notNull(),
	updatedAt: text("updated_at").notNull()
}, (table) => [
	uniqueIndex("cases_case_code_uq").on(table.caseCode),
	uniqueIndex("cases_work_order_uq").on(table.workOrderId),
	index("cases_status_branch_idx").on(table.workflowStatus, table.branchRef, table.updatedAt)
]);
var authSessions = sqliteTable("auth_sessions", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
	tokenHash: text("token_hash").notNull(),
	expiresAt: text("expires_at").notNull(),
	createdAt: text("created_at").notNull(),
	lastUsedAt: text("last_used_at").notNull()
}, (table) => [uniqueIndex("auth_sessions_token_uq").on(table.tokenHash), index("auth_sessions_user_idx").on(table.userId, table.expiresAt)]);
var caseAssignments = sqliteTable("case_assignments", {
	id: text("id").primaryKey(),
	caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
	role: text("role", { enum: [
		"oa",
		"seo_lead",
		"it",
		"technical_reviewer"
	] }).notNull(),
	assignedBy: text("assigned_by").notNull().references(() => users.id),
	assignedAt: text("assigned_at").notNull(),
	unassignedAt: text("unassigned_at")
}, (table) => [index("case_assignments_case_active_idx").on(table.caseId, table.role, table.unassignedAt), index("case_assignments_user_active_idx").on(table.userId, table.unassignedAt)]);
var caseRevisions = sqliteTable("case_revisions", {
	id: text("id").primaryKey(),
	caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
	revision: integer("revision").notNull(),
	sourceVersion: integer("source_version").notNull(),
	sourceHash: text("source_hash").notNull(),
	contentJson: text("content_json").notNull(),
	technicalSnapshotJson: text("technical_snapshot_json").notNull(),
	catalogSnapshotJson: text("catalog_snapshot_json").notNull(),
	seoSnapshotJson: text("seo_snapshot_json").notNull(),
	technicalDigest: text("technical_digest").notNull(),
	createdBy: text("created_by").notNull().references(() => users.id),
	createdAt: text("created_at").notNull()
}, (table) => [uniqueIndex("case_revisions_case_revision_uq").on(table.caseId, table.revision), index("case_revisions_created_idx").on(table.caseId, table.createdAt)]);
var mediaAssets = sqliteTable("media_assets", {
	id: text("id").primaryKey(),
	caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
	r2KeyOriginal: text("r2_key_original").notNull(),
	r2KeyWebp: text("r2_key_webp"),
	r2KeyAvif: text("r2_key_avif"),
	mimeType: text("mime_type").notNull(),
	byteSize: integer("byte_size").notNull(),
	width: integer("width").notNull(),
	height: integer("height").notNull(),
	sha256: text("sha256").notNull(),
	perceptualHash: text("perceptual_hash"),
	processingStatus: text("processing_status", { enum: [
		"pending",
		"processing",
		"ready",
		"rejected",
		"failed"
	] }).notNull(),
	rejectionCode: text("rejection_code"),
	uploadedBy: text("uploaded_by").notNull().references(() => users.id),
	uploadedAt: text("uploaded_at").notNull()
}, (table) => [
	uniqueIndex("media_assets_r2_key_uq").on(table.r2KeyOriginal),
	uniqueIndex("media_assets_case_sha_uq").on(table.caseId, table.sha256),
	index("media_assets_processing_idx").on(table.processingStatus, table.uploadedAt)
]);
var caseRevisionMedia = sqliteTable("case_revision_media", {
	revisionId: text("revision_id").notNull().references(() => caseRevisions.id, { onDelete: "cascade" }),
	mediaAssetId: text("media_asset_id").notNull().references(() => mediaAssets.id),
	role: text("role", { enum: [
		"vehicle_after",
		"lamp_stock_before",
		"lamp_after",
		"product_identity",
		"beam_low_after",
		"beam_high_after",
		"installation_qc",
		"handover_detail"
	] }).notNull(),
	caption: text("caption").notNull(),
	altText: text("alt_text").notNull(),
	capturedAt: text("captured_at").notNull(),
	proofState: text("proof_state", { enum: [
		"CASE_OBSERVED",
		"CASE_MEASURED",
		"FOLLOWUP_CONFIRMED"
	] }).notNull(),
	focalPointDesktopJson: text("focal_point_desktop_json"),
	focalPointMobileJson: text("focal_point_mobile_json"),
	sortOrder: integer("sort_order").notNull()
}, (table) => [primaryKey({ columns: [table.revisionId, table.role] }), uniqueIndex("case_revision_media_asset_uq").on(table.revisionId, table.mediaAssetId)]);
var rightsAttestations = sqliteTable("rights_attestations", {
	id: text("id").primaryKey(),
	caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
	mediaAssetId: text("media_asset_id").notNull().references(() => mediaAssets.id, { onDelete: "cascade" }),
	status: text("status", { enum: [
		"confirmed",
		"rejected",
		"revoked"
	] }).notNull(),
	policyVersion: text("policy_version").notNull(),
	attestedBy: text("attested_by").notNull().references(() => users.id),
	attestedAt: text("attested_at").notNull()
}, (table) => [index("rights_attestations_asset_idx").on(table.mediaAssetId, table.attestedAt)]);
var technicalReviews = sqliteTable("technical_reviews", {
	id: text("id").primaryKey(),
	caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
	revisionId: text("revision_id").notNull().references(() => caseRevisions.id, { onDelete: "cascade" }),
	technicalDigest: text("technical_digest").notNull(),
	reviewerId: text("reviewer_id").notNull().references(() => users.id),
	decision: text("decision", { enum: ["approved", "changes_requested"] }).notNull(),
	note: text("note").notNull().default(""),
	decidedAt: text("decided_at").notNull()
}, (table) => [uniqueIndex("technical_reviews_revision_reviewer_uq").on(table.revisionId, table.reviewerId), index("technical_reviews_case_idx").on(table.caseId, table.decidedAt)]);
var caseFeedback = sqliteTable("case_feedback", {
	id: text("id").primaryKey(),
	caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
	revision: integer("revision").notNull(),
	parentFeedbackId: text("parent_feedback_id").references(() => caseFeedback.id, { onDelete: "set null" }),
	authorId: text("author_id").notNull().references(() => users.id),
	category: text("category", { enum: [
		"content",
		"evidence",
		"seo",
		"technical",
		"general"
	] }).notNull().default("general"),
	message: text("message").notNull(),
	status: text("status", { enum: ["open", "resolved"] }).notNull().default("open"),
	resolvedBy: text("resolved_by").references(() => users.id),
	resolvedAt: text("resolved_at"),
	createdAt: text("created_at").notNull()
}, (table) => [index("case_feedback_case_revision_idx").on(table.caseId, table.revision, table.createdAt), index("case_feedback_status_idx").on(table.status, table.createdAt)]);
var gateEvaluations = sqliteTable("gate_evaluations", {
	id: text("id").primaryKey(),
	caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
	revisionId: text("revision_id").notNull().references(() => caseRevisions.id, { onDelete: "cascade" }),
	rulesetVersion: text("ruleset_version").notNull(),
	sourcePassed: integer("source_passed", { mode: "boolean" }).notNull(),
	contentPassed: integer("content_passed", { mode: "boolean" }).notNull(),
	evidencePassed: integer("evidence_passed", { mode: "boolean" }).notNull(),
	technicalPassed: integer("technical_passed", { mode: "boolean" }).notNull(),
	seoPassed: integer("seo_passed", { mode: "boolean" }).notNull(),
	issuesJson: text("issues_json").notNull(),
	evaluatedAt: text("evaluated_at").notNull()
}, (table) => [index("gate_evaluations_revision_idx").on(table.revisionId, table.evaluatedAt)]);
var urlRegistry = sqliteTable("url_registry", {
	id: text("id").primaryKey(),
	caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
	slug: text("slug").notNull(),
	canonicalUrl: text("canonical_url").notNull(),
	intentKey: text("intent_key").notNull(),
	ownerType: text("owner_type", { enum: [
		"case",
		"product",
		"hub"
	] }).notNull(),
	lockedAt: text("locked_at"),
	createdAt: text("created_at").notNull()
}, (table) => [
	uniqueIndex("url_registry_slug_uq").on(table.slug),
	uniqueIndex("url_registry_canonical_uq").on(table.canonicalUrl),
	uniqueIndex("url_registry_intent_uq").on(table.intentKey),
	uniqueIndex("url_registry_case_uq").on(table.caseId)
]);
var publications = sqliteTable("publications", {
	id: text("id").primaryKey(),
	caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
	revisionId: text("revision_id").notNull().references(() => caseRevisions.id),
	idempotencyKey: text("idempotency_key").notNull(),
	state: text("state", { enum: [
		"pending",
		"rendered",
		"published",
		"failed",
		"rolled_back"
	] }).notNull(),
	publicUrl: text("public_url"),
	renderedHash: text("rendered_hash"),
	errorCode: text("error_code"),
	publishedBy: text("published_by").references(() => users.id),
	createdAt: text("created_at").notNull(),
	completedAt: text("completed_at")
}, (table) => [uniqueIndex("publications_idempotency_uq").on(table.idempotencyKey), index("publications_case_state_idx").on(table.caseId, table.state, table.createdAt)]);
var dataIssues = sqliteTable("data_issues", {
	id: text("id").primaryKey(),
	caseId: text("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
	target: text("target", { enum: [
		"work_order",
		"catalog",
		"media",
		"price"
	] }).notNull(),
	ownerTeam: text("owner_team", { enum: [
		"workshop",
		"catalog",
		"media",
		"accounting"
	] }).notNull(),
	status: text("status", { enum: [
		"open",
		"resolved",
		"rejected"
	] }).notNull().default("open"),
	message: text("message").notNull(),
	openedBy: text("opened_by").notNull().references(() => users.id),
	openedAt: text("opened_at").notNull(),
	resolvedBy: text("resolved_by").references(() => users.id),
	resolvedAt: text("resolved_at")
}, (table) => [index("data_issues_owner_status_idx").on(table.ownerTeam, table.status, table.openedAt)]);
var auditEvents = sqliteTable("audit_events", {
	id: text("id").primaryKey(),
	caseId: text("case_id").references(() => cases.id, { onDelete: "set null" }),
	actorId: text("actor_id").notNull().references(() => users.id),
	actorRole: text("actor_role").notNull(),
	action: text("action").notNull(),
	entityType: text("entity_type").notNull(),
	entityId: text("entity_id").notNull(),
	revision: integer("revision"),
	detailJson: text("detail_json").notNull(),
	ipHash: text("ip_hash"),
	createdAt: text("created_at").notNull()
}, (table) => [index("audit_events_case_idx").on(table.caseId, table.createdAt), index("audit_events_actor_idx").on(table.actorId, table.createdAt)]);
var notifications = sqliteTable("notifications", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
	type: text("type").notNull(),
	title: text("title").notNull(),
	body: text("body").notNull().default(""),
	caseId: text("case_id").references(() => cases.id, { onDelete: "set null" }),
	payloadJson: text("payload_json").notNull().default("{}"),
	readAt: text("read_at"),
	createdAt: text("created_at").notNull()
}, (table) => [index("notifications_user_read_idx").on(table.userId, table.readAt, table.createdAt)]);
var outboxEvents = sqliteTable("outbox_events", {
	id: text("id").primaryKey(),
	aggregateType: text("aggregate_type").notNull(),
	aggregateId: text("aggregate_id").notNull(),
	eventType: text("event_type").notNull(),
	payloadJson: text("payload_json").notNull(),
	status: text("status", { enum: [
		"pending",
		"processing",
		"completed",
		"failed"
	] }).notNull().default("pending"),
	attemptCount: integer("attempt_count").notNull().default(0),
	availableAt: text("available_at").notNull(),
	processedAt: text("processed_at"),
	lastError: text("last_error"),
	createdAt: text("created_at").notNull()
}, (table) => [index("outbox_status_available_idx").on(table.status, table.availableAt)]);
//#endregion
export { Table as A, __exportAll as B, StringChunk as C, isSQLWrapper as D, isDriverValueEncoder as E, WithSubquery as F, Column as I, entityKind as L, getTableUniqueName as M, ViewBaseConfig as N, sql as O, Subquery as P, is as R, SQL as S, fillPlaceholders as T, __toESM as V, mapResultRow as _, caseRevisions as a, Param as b, schema_exports as c, SQLiteTable as d, SQLiteColumn as f, haveSameKeys as g, getTableLikeName as h, caseFeedback as i, getTableName as j, Columns as k, userRoles as l, getTableColumns as m, authSessions as n, cases as o, applyMixins as p, caseAssignments as r, notifications as s, auditEvents as t, users as u, mapUpdateSet as v, View as w, Placeholder as x, orderSelectedFields as y, __commonJSMin as z };
