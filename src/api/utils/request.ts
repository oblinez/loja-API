export class Request {
  public hasFieldByTree(info, tree) {
    let fields = info.fieldNodes[0].selectionSet.selections

    return this.searchField(fields, tree);
  }

  private searchField(fields, tree) {
    let found = false;
    for (let i = 0; i < tree.length; i++) {
      const t = tree[i];
      const hasKey = fields.find(_ => {
        if (!_.name && _.kind == 'InlineFragment') {
          return this.searchField(_.selectionSet.selections, tree)
        }
        return (_.name.value === t)
      });

      if (hasKey && i == (tree.length - 1)) found = true;
      else if (hasKey && hasKey.selectionSet) fields = hasKey.selectionSet.selections;
      else {
        found = false;
        i = tree.length;
      }
    }
    return found;
  }
}