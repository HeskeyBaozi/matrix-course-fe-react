import { types } from 'mobx-state-tree';

const DiscussionContentState = types
  .model({
    link: types.maybe(types.model({
      course_id: types.number,
      dis_id: types.number
    })),
    title: types.string,
    rep_id: types.maybe(types.number),
    text: types.maybe(types.string)
  });

const DiscussionSenderState = types
  .model({
    id: types.identifier(types.number),
    name: types.model({
      username: types.string,
      nickname: types.string
    })
  });

const DiscussionState = types
  .model({
    id: types.identifier(types.number),
    time: types.string,
    status: types.number,
    type: types.literal('discussion'),
    content: DiscussionContentState,
    sender: DiscussionSenderState
  })
  .views(({ content, sender }) => ({
    get displayName() {
      return sender.name.nickname;
    },
    get displayLink() {
      return content.link &&
        `/course/${content.link.course_id}/discussion/${content.link.dis_id}`;
    },
    get displayText() {
      return content.text === '@通知' ? (
        content.rep_id
          ? `在话题 "${content.title}" 的评论回复中@提到你`
          : `在话题 "${content.title}" 的评论中@提到你`
      ) : (
          content.rep_id
            ? `回复了你在话题 "${content.title}" 中的评论`
            : `评论了你的话题 "${content.title}"`
        );
    },
    get displayAvatar() {
      return { icon: 'user', src: `/api/users/profile/avatar?username=${this.displayName}` };
    }
  }));

type DiscussionStateType = typeof DiscussionState.Type;

export interface IDiscussionState extends DiscussionStateType { }

const CourseContentState = types
  .model({
    link: types.number,
    text: types.string
  });

const CourseSenderState = types
  .model({
    id: types.identifier(types.number),
    name: types.string
  });

const CourseState = types
  .model({
    id: types.identifier(types.number),
    time: types.string,
    status: types.number,
    type: types.literal('course'),
    content: CourseContentState,
    sender: CourseSenderState
  })
  .views(({ content, sender }) => ({
    get displayName() {
      return sender.name;
    },
    get displayLink() {
      return `/course/${content.link}`;
    },
    get displayText() {
      return content.text;
    },
    get displayAvatar() {
      return { icon: 'book' };
    }
  }));

const HomeworkContentState = types
  .model({
    action: types.string,
    prob_title: types.string,
    link: types.maybe(types.model({
      type: types.maybe(types.string),
      course_id: types.number,
      ca_id: types.number
    }))
  });

const HomeworkSenderState = types
  .model({
    id: types.identifier(types.number),
    role: types.enumeration([ 'people', 'course' ]),
    name: types.union(types.model({
      username: types.string,
      nickname: types.string
    }), types.string)
  });

const HomeworkState = types
  .model({
    id: types.identifier(types.number),
    time: types.string,
    status: types.number,
    type: types.literal('homework'),
    content: HomeworkContentState,
    sender: HomeworkSenderState
  })
  .views(({ content, sender }) => ({
    get displayName() {
      return sender.role === 'people' && typeof sender.name !== 'string'
        ? sender.name.nickname : sender.name;
    },
    get displayLink() {
      return content.link && (
        content.link.type
          ? `/course/${content.link.course_id}/assignment/${content.link.ca_id}`
          : `/course/${content.link.course_id}`
      );
    },
    get displayText() {
      return `${content.action}了作业 "${content.prob_title}"`;
    },
    get displayAvatar() {
      return {
        icon: 'book', src: sender.role === 'people' && typeof sender.name !== 'string'
          ? `/api/users/profile/avatar?username=${this.displayName}` : void 0
      };
    }
  }));

const LibraryContentState = types
  .model({
    link: types.maybe(types.model({
      lib_id: types.number,
      prob_id: types.number
    })),
    prob_title: types.string,
    library_name: types.string,
    action: types.string
  });

const LibrarySenderState = types
  .model({
    id: types.identifier(types.number),
    role: types.literal('people'),
    name: types.union(types.model({
      username: types.string,
      nickname: types.string
    }), types.string)
  });

const LibraryState = types
  .model({
    id: types.identifier(types.number),
    time: types.string,
    status: types.number,
    type: types.literal('library'),
    content: LibraryContentState,
    sender: LibrarySenderState
  })
  .views(({ content, sender }) => ({
    get displayName() {
      return sender.role === 'people' && typeof sender.name !== 'string'
        ? sender.name.nickname : sender.name;
    },
    get displayLink() {
      return null; // todo: library link is not implemented.
    },
    get displayText() {
      return `${content.action}了题目 "${content.prob_title}"`;
    },
    get displayAvatar() {
      return { icon: 'info-circle-o' };
    }
  }));

const SystemContentState = types
  .model({
    text: types.string
  });

const SystemSenderState = types.string;

const SystemState = types
  .model({
    id: types.identifier(types.number),
    time: types.string,
    status: types.number,
    type: types.literal('system'),
    content: SystemContentState,
    sender: SystemSenderState
  })
  .views(({ content, sender }) => ({
    get displayName() {
      return sender;
    },
    get displayLink() {
      return null;
    },
    get displayText() {
      return content.text;
    },
    get displayAvatar() {
      return { icon: 'info-circle-o' };
    }
  }));

export const MessageState = types.union(
  DiscussionState,
  CourseState,
  HomeworkState,
  LibraryState,
  SystemState
);

export type MessageStateType = typeof MessageState.Type;
