import React from "react";
import styles from "./Playlists.module.css";

import List from "../List";
import { DeleteButton } from "../Button";

export const Playlists = ({ items, selected, onSelect, onRemove }) => {

	return (
		<List
			className={styles.playlists}
			items={items}
			itemKey={(pl) => pl.id}
			itemSelected={(pl) => selected && pl.id === selected.id}
			itemClick={(pl, ix, e) => onSelect && onSelect(pl)}
			itemSecondaryActions={(pl, ix) => onRemove && <DeleteButton onClick={() => onRemove(pl.id)} />}
			itemTitle={(pl) => pl.name}
		/>
	);
}

export default Playlists;