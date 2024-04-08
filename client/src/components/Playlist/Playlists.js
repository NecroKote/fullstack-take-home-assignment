import React from "react";
import styles from "./Playlists.module.css";

import { List, ListRow, ListRowEmpty } from "../List";
import { DeleteButton } from "../Button";

export const Playlists = ({ items, selected, onSelect, onRemove }) => {
  return (
    <List className={styles.playlists}
      noItemsContent={<ListRowEmpty>No playlists</ListRowEmpty>}
    >
      {(items || []).map((pl) =>
        <ListRow key={pl.id}
          title={pl.name}
          selected={selected && selected.id === pl.id}
          onClick={() => onSelect(pl)}
          secondaryActions={onRemove && <DeleteButton onClick={(e) => { e.preventDefault(); onRemove(pl.id) }} />}
        />
      )}
    </List>
  )
}

export default Playlists;