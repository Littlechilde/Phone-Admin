export function formatTree(data,id='id',pid='parentId',child ='children',root){
  const tree = [];
  if(data && data.length > 0){
    data.forEach(item=>{
      if(item[pid] == root){
        const children = formatTree(data,id,pid,child,item[id]);
        if(children &&children.length){
          item[child] = children;
        }
        tree.push(item);
      }
    })
  }
  return tree;
}