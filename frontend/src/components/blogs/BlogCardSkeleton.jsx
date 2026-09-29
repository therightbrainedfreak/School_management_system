import Skeleton from '../Skeleton'

function BlogCardSkeleton() {
    return (
        <div className="flex bg-page shadow-el-2 items-start justify-center flex-col gap-2 p-4 rounded-lg">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
        </div>
    );
}

export default BlogCardSkeleton