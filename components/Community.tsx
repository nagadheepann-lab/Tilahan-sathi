import React, { useState } from 'react';
// FIX: The `ForumPost` type is imported from `../types` instead of `../constants`.
import { FORUM_POSTS } from '../constants';
import { ForumPost } from '../types';
import Card from './common/Card';
import { useLocalization } from '../hooks/useLocalization';
import InputField from './common/InputField';
import FormControl from './common/FormControl';
import ShareIcon from './icons/ShareIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';
import FacebookIcon from './icons/FacebookIcon';
import TwitterIcon from './icons/TwitterIcon';

const SocialShareButtons: React.FC<{ post: ForumPost }> = ({ post }) => {
    const shareUrl = "https://tilahan-sathi.example.com"; // Placeholder URL
    const shareText = `Check out this discussion on Tilahan Sathi: "${post.title}"`;

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    const shareLinks = {
        whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
    };

    const handleShare = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="flex items-center space-x-2">
            <button onClick={() => handleShare(shareLinks.whatsapp)} className="text-green-500 hover:text-green-400 p-1 rounded-full hover:bg-white/10 transition-colors">
                <WhatsAppIcon className="h-6 w-6" />
            </button>
            <button onClick={() => handleShare(shareLinks.facebook)} className="text-blue-600 hover:text-blue-500 p-1 rounded-full hover:bg-white/10 transition-colors">
                <FacebookIcon className="h-6 w-6" />
            </button>
            <button onClick={() => handleShare(shareLinks.twitter)} className="text-blue-400 hover:text-blue-300 p-1 rounded-full hover:bg-white/10 transition-colors">
                <TwitterIcon className="h-6 w-6" />
            </button>
        </div>
    );
};


const Community: React.FC = () => {
  const { t } = useLocalization();
  const [sharingPostId, setSharingPostId] = useState<number | null>(null);
  
  const handleToggleShare = (postId: number) => {
    setSharingPostId(prevId => (prevId === postId ? null : postId));
  };
  
  return (
    <div className="p-4">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-white">{t('communityTitle')}</h1>
        <p className="text-gray-300">{t('communitySubtitle')}</p>
      </header>

      <Card className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4">{t('startDiscussion')}</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <FormControl label={t('postTitle')} htmlFor="post-title">
                <InputField id="post-title" type="text" placeholder={t('postTitlePlaceholder')} />
            </FormControl>
            <FormControl label={t('postContent')} htmlFor="post-content">
                <InputField as="textarea" id="post-content" rows={4} placeholder={t('postContentPlaceholder')} />
            </FormControl>
            <button
                type="submit"
                className="w-full bg-brand-yellow text-brand-dark font-bold py-3 px-4 rounded-lg shadow-md hover:opacity-90 transition-opacity"
            >
                {t('postDiscussion')}
            </button>
        </form>
      </Card>


      <div className="space-y-4">
        {FORUM_POSTS.map(post => (
          <Card key={post.id}>
            <div className="flex items-start space-x-4">
              <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">{post.title}</h2>
                <p className="text-sm text-gray-400">by {post.author} - {post.timestamp}</p>
                <p className="mt-2 text-gray-300">{post.content}</p>
                
                <div className="mt-4">
                    <div className="flex justify-between items-center">
                       <span className="text-sm text-brand-yellow font-semibold">
                        {post.replies} {t('replies')}
                       </span>
                       <div className="flex items-center space-x-2">
                            <button onClick={() => handleToggleShare(post.id)} className="flex items-center text-sm text-gray-300 hover:text-white font-semibold py-1 px-3 rounded-lg transition-colors">
                                <ShareIcon className="h-4 w-4 mr-1"/> {t('share')}
                            </button>
                           <button className="text-sm bg-brand-green hover:bg-brand-green-light text-white font-semibold py-1 px-3 rounded-lg transition-colors">
                             {t('sendReply')}
                           </button>
                       </div>
                    </div>
                    {sharingPostId === post.id && (
                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center space-x-3 animate-fade-in-down">
                            <span className="text-sm font-semibold text-gray-300">Share via:</span>
                            <SocialShareButtons post={post} />
                        </div>
                    )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Community;